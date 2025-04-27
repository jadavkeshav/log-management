import asyncio
import json
import os
import pickle
import re
import uuid
from datetime import datetime, timedelta
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import IsolationForest
import chromadb
from chromadb.config import Settings
from groq import Groq
import uvicorn
import logging
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY=os.getenv('API_KEY')

def convert_timestamps_to_iso(obj):
    """Recursively convert MongoDB Timestamp objects to ISO format strings"""
    if isinstance(obj, dict):
        return {key: convert_timestamps_to_iso(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_timestamps_to_iso(item) for item in obj]
    elif isinstance(obj, pd.Timestamp):
        return obj.isoformat()
    elif hasattr(obj, 'isoformat'):  # For datetime objects
        return obj.isoformat()
    return obj

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Changed from INFO to DEBUG for more verbose output
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# === Setup ===
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Environment Variables ===
GROQ_API_KEY = os.getenv("GROQ_API_KEY",API_KEY)
SUMMARY_INTERVAL_MINUTES = 3
SUMMARY_FILE_PATH = os.path.join(os.path.dirname(__file__), "log_summaries", "continuous_summary.txt")
SERVER_PORT = 5050
  # Changed from 5000 to 5001
APPLICATION_BACKEND_URL = "http://localhost:5000"  # Application backend URL

# === Initialize Clients ===
groq_client = Groq(api_key=GROQ_API_KEY)
chroma_client = chromadb.Client(Settings(anonymized_telemetry=False))

# === Initialize ChromaDB Collections ===
try:
    logs_col = chroma_client.get_or_create_collection("logs")
    logger.info("ChromaDB logs collection initialized")
except Exception as e:
    logger.error(f"Failed to initialize ChromaDB logs collection: {e}")
    raise

# === Load Isolation Forest Model ===
model_path = os.path.join(os.path.dirname(__file__), "models", "anamoly_Isolation_forest.pkl")
try:
    with open(model_path, "rb") as f:
        iso_model = pickle.load(f)
        logger.info(f"Loaded existing Isolation Forest model from {model_path}")
except Exception as e:
    logger.error(f"Failed to load Isolation Forest model: {e}")
    raise

# === Connected Clients Manager ===
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

# === Variables to track log processing ===
last_summary_time = datetime.now()
log_buffer = []

# Ensure summary file directory exists
os.makedirs(os.path.dirname(SUMMARY_FILE_PATH), exist_ok=True)

# Initialize summary file if it doesn't exist
if not os.path.exists(SUMMARY_FILE_PATH):
    with open(SUMMARY_FILE_PATH, "w") as f:
        f.write(f"--- SYSTEM STARTED AT {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ---\n")
        f.write("Waiting for logs to process...\n\n\n\n")

# === Feature Engineering Functions ===
def prepare_log_features(log_dict):
    """Extract and engineer features from a log entry"""
    
    # Handle different possible structures in the log data
    if isinstance(log_dict, str):
        try:
            log_dict = json.loads(log_dict)
        except:
            # If it's still a string, try to parse it more aggressively
            log_dict = {
                "raw": log_dict,
                "timestamp": datetime.now().isoformat()
            }
    
    # Normalize field names (handle both camelCase and snake_case)
    normalized = {}
    for k, v in log_dict.items():
        key = k.lower().replace(" ", "_")
        normalized[key] = v
    
    # Create a feature dict with all relevant fields
    features = {
        "timestamp": normalized.get("timestamp", datetime.now().isoformat()),
        "ip": normalized.get("ip", "unknown"),
        "method": normalized.get("method", "GET"),
        "url": normalized.get("url", normalized.get("originalurl", "/")),
        "protocol": normalized.get("protocol", "HTTP/1.1"),
        "status_code": int(normalized.get("statuscode", normalized.get("status_code", 200))),
        "bytes_sent": int(normalized.get("bytessent", normalized.get("bytes_sent", 0))),
        "user_agent": normalized.get("useragent", normalized.get("user_agent", "unknown")),
    }
    
    # Add engineered features
    features["url_length"] = len(features["url"])
    features["url_depth"] = features["url"].count("/")
    features["num_encoded_chars"] = len(re.findall(r'%[0-9A-Fa-f]{2}', features["url"]))
    features["num_special_chars"] = len(re.findall(r'[|,;]', features["url"]))
    
    return features

# === Anomaly Detection ===
def detect_anomalies(logs_data):
    """Detect anomalies in log data"""
    if not logs_data:
        return []
    
    # Convert to DataFrame
    df = pd.DataFrame(logs_data)
    
    # Ensure timestamp is datetime
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    
    # Prepare features for model
    categorical_cols = ["method", "protocol"]
    for col in categorical_cols:
        df[col] = LabelEncoder().fit_transform(df[col])
    
    # Select features for model
    X = df[[
    'url_length',
    'url_depth',
    'num_encoded_chars',
    'num_special_chars',
    'bytes_sent',
    'status_code']]
    
    # Use our model to predict
    global iso_model
    
    # If we have enough data, refit the model occasionally
    if len(df) > 50 and not hasattr(iso_model, "fitted_"):
        iso_model.fit(X)
        iso_model.fitted_ = True
        # Save the model
        with open(model_path, "wb") as f:
            pickle.dump(iso_model, f)
        logger.info("Refitted and saved Isolation Forest model")
    
    # Predict anomalies
    df["anomaly"] = iso_model.predict(X)
    df["anomaly_score"] = iso_model.decision_function(X)
    
    return df.to_dict(orient="records")

# === Summarize Logs ===
def summarize_logs(logs_df):
    """Generate a summary of logs"""
    # Convert to DataFrame if it's a list
    if isinstance(logs_df, list):
        if not logs_df:  # Check if the list is empty
            return {
                "message": "No logs to summarize"
            }
        logs_df = pd.DataFrame(logs_df)
    
    # Check if DataFrame is empty after conversion
    if isinstance(logs_df, pd.DataFrame) and logs_df.empty:
        return {
            "message": "No logs to summarize"
        }
    
    # Ensure timestamp is datetime
    logs_df["timestamp"] = pd.to_datetime(logs_df["timestamp"])
    
    # Calculate summary statistics
    try:
        time_range_start = logs_df["timestamp"].min()
        time_range_end = logs_df["timestamp"].max()
        
        # Count by method
        method_counts = logs_df["method"].value_counts().to_dict()
        
        # Count by URL
        top_endpoints = logs_df["url"].value_counts().head(5).to_dict()
        
        # Count by status code
        status_counts = logs_df["status_code"].value_counts().to_dict()
        
        # Anomaly information
        anomaly_count = (logs_df["anomaly"] == -1).sum() if "anomaly" in logs_df.columns else 0
        
        # Detailed anomaly logs
        anomaly_logs = []
        if "anomaly" in logs_df.columns:
            anomalies = logs_df[logs_df["anomaly"] == -1]
            for _, row in anomalies.iterrows():
                anomaly_logs.append(f"{row['timestamp'].strftime('%Y-%m-%dT%H:%M:%S')} - ANOMALY: {row['method']} {row['url']} {row['status_code']}")
        
        return {
            "time_range_start": time_range_start,
            "time_range_end": time_range_end,
            "total_logs": len(logs_df),
            "anomaly_count": anomaly_count,
            "top_endpoints": top_endpoints,
            "method_counts": method_counts,
            "status_counts": status_counts,
            "anomaly_logs": anomaly_logs
        }
    except Exception as e:
        logger.error(f"Error generating summary: {e}", exc_info=True)
        return {
            "error": str(e),
            "message": "Failed to generate summary"
        }

# === Store Logs in ChromaDB ===
def store_logs_in_chromadb(logs_with_anomalies):
    """Store logs with anomaly detection in ChromaDB"""
    try:
        documents = []
        metadatas = []
        ids = []
        
        for log in logs_with_anomalies:
            log_id = str(uuid.uuid4())
            documents.append(str(log))
            metadata = {
                "timestamp": str(log["timestamp"]),
                "ip": log["ip"],
                "url": log["url"],
                "method": log["method"],
                "status_code": int(log["status_code"]),
                "stored_at": datetime.now().isoformat(),  # Add storage timestamp
            }
            
            if "anomaly" in log:
                metadata["anomaly_label"] = int(log["anomaly"])
                metadata["anomaly_score"] = float(log["anomaly_score"])
            
            metadatas.append(metadata)
            ids.append(log_id)
        
        logs_col.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        logger.info(f"Stored {len(logs_with_anomalies)} logs in ChromaDB")
        return True
    except Exception as e:
        logger.error(f"Failed to store logs in ChromaDB: {e}")
        return False

# === Clear Logs from ChromaDB ===
def clear_logs_from_chromadb():
    """Clear logs from ChromaDB - DISABLED to preserve historical logs"""
    logger.info("Log clearing is disabled to preserve historical data")
    return True

# === Append Summary to File ===
def append_summary_to_file(summary):
    """Append summary to log_summary.txt file"""
    try:
        with open(SUMMARY_FILE_PATH, "a") as f:
            f.write(f"--- SUMMARY FOR {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ---\n")
            f.write(f"Time Range: {summary['time_range_start']} to {summary['time_range_end']}\n")
            f.write(f"Total Logs: {summary['total_logs']}\n")
            f.write(f"Anomalies Detected: {summary['anomaly_count']}\n\n")
            
            f.write("Top Endpoints:\n")
            for endpoint, count in summary['top_endpoints'].items():
                f.write(f" - {endpoint}: {count}\n")
            f.write("\n")
            
            f.write("Method Distribution:\n")
            for method, count in summary['method_counts'].items():
                f.write(f" - {method}: {count}\n")
            f.write("\n")
            
            f.write("Status Code Distribution:\n")
            for status, count in summary['status_counts'].items():
                f.write(f" - {status}: {count}\n")
            f.write("\n")
            
            if summary['anomaly_logs']:
                f.write("Detailed Anomaly Logs:\n")
                for log in summary['anomaly_logs']:
                    f.write(f" - {log}\n")
                f.write("\n")
            
            f.write("--------------------------------------------------\n\n")
        
        logger.info("Appended summary to log_summary.txt")
        return True
    except Exception as e:
        logger.error(f"Failed to append summary to file: {e}")
        return False

# === Process Logs and Generate Summary ===
async def process_logs_and_generate_summary():
    """Process logs and generate summary if needed"""
    global last_summary_time
    global log_buffer
    
    current_time = datetime.now()
    
    # Check if it's time to generate a summary
    time_since_last_summary = (current_time - last_summary_time).total_seconds() / 60
    
    logger.debug(f"Time since last summary: {time_since_last_summary:.2f} minutes. Buffer size: {len(log_buffer)} logs")
    
    if time_since_last_summary >= SUMMARY_INTERVAL_MINUTES and log_buffer:
        logger.info(f"Summary condition met: {time_since_last_summary:.2f} minutes since last summary, buffer has {len(log_buffer)} logs")
        try:
            logger.info(f"Generating summary for {len(log_buffer)} logs")
            
            # Process anomalies
            logs_with_anomalies = detect_anomalies(log_buffer)
            logger.debug(f"Anomaly detection complete: {sum(1 for log in logs_with_anomalies if log.get('anomaly', 0) == -1)} anomalies found")
            
            # Generate summary
            summary = summarize_logs(logs_with_anomalies)
            logger.debug(f"Summary generated: {summary}")
            
            # Append summary to file
            success = append_summary_to_file(summary)
            logger.info(f"Summary appended to file: {success}")
            
            # Don't clear logs from ChromaDB - we disabled this function
            clear_success = clear_logs_from_chromadb()
            logger.info(f"ChromaDB preserved: {clear_success}")
            
            # Don't reset buffer - keep historical logs
            # old_buffer_size = len(log_buffer)
            # log_buffer = []
            # logger.debug(f"Log buffer reset: {old_buffer_size} logs cleared")
            logger.debug(f"Keeping log buffer intact with {len(log_buffer)} logs to preserve history")
            
            # Update last summary time
            last_summary_time = current_time
            logger.info(f"Last summary time updated to: {last_summary_time}")
            
            # Broadcast summary to connected clients
            await manager.broadcast({
                "type": "summary",
                "data": summary
            })
            
            logger.info("Summary generated and broadcast to clients")
        except Exception as e:
            logger.error(f"Failed to process logs and generate summary: {e}", exc_info=True)
    elif time_since_last_summary < SUMMARY_INTERVAL_MINUTES:
        logger.debug(f"Not enough time elapsed for summary. Waiting {SUMMARY_INTERVAL_MINUTES - time_since_last_summary:.2f} more minutes")
    elif not log_buffer:
        logger.debug("Log buffer is empty, no summary to generate")

# === Chat Request Model ===
class ChatRequest(BaseModel):
    query: str

# === API Models ===
class LogEntry(BaseModel):
    """Model for a single log entry"""
    ip: str = "unknown"
    timestamp: str = None
    method: str = "GET"
    url: str = "/"
    protocol: str = "HTTP/1.1"
    status_code: int = 200
    bytes_sent: int = 0
    user_agent: str = "unknown"

class LogBatch(BaseModel):
    """Model for a batch of log entries"""
    logs: list[LogEntry]

class AnomalyResponse(BaseModel):
    """Response model for anomaly detection results"""
    total_logs: int
    anomalies_detected: int
    anomaly_details: list
    prediction_time: str

# === API Routes ===
@app.get("/")
async def root():
    return {"message": "Log Management Server", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/chat")
async def chat(request: ChatRequest):
    """Chat endpoint that uses log summaries as context"""
    try:
        query = request.query
        
        # Read the log_summary.txt file
        if not os.path.exists(SUMMARY_FILE_PATH):
            return JSONResponse(
                status_code=404,
                content={"message": "No log summaries available yet"}
            )
        
        with open(SUMMARY_FILE_PATH, "r") as f:
            log_summaries = f.read()
        
        # Create the prompt with the log summaries as context
        prompt = f"""
        You are a log analysis assistant. Answer the user's query based on the log summaries provided.
        
        === Log Summaries ===
        {log_summaries}
        
        === User Query ===
        {query}
        
        Please provide a concise and informative answer based only on the information in the log summaries.
        """
        
        # Call the Groq API
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        
        return {
            "response": response.choices[0].message.content
        }
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return JSONResponse(
            status_code=500,
            content={"message": f"Error: {str(e)}"}
        )

@app.post("/anomaly_detection")
async def anomaly_detection(log_batch: LogBatch):
    """Anomaly detection endpoint for real-time detection of anomalies in logs.
    
    This endpoint accepts a batch of log entries and returns anomaly detection results
    along with historical context.
    """
    try:
        logger.debug(f"Received anomaly detection request with {len(log_batch.logs)} logs")
        start_time = datetime.now()
        
        # Extract and process logs from the request
        try:
            logs_data = [prepare_log_features(log.dict()) for log in log_batch.logs]
            logger.debug(f"Processed {len(logs_data)} logs through feature engineering")
        except Exception as e:
            logger.error(f"Error processing log features: {e}")
            return JSONResponse(
                status_code=400,
                content={"message": f"Error processing logs: {str(e)}"}
            )
        
        if not logs_data:
            return JSONResponse(
                status_code=400,
                content={"message": "No valid logs provided"}
            )
        
        # Process anomalies using the Isolation Forest model
        try:
            logs_with_anomalies = detect_anomalies(logs_data)
            anomaly_count = sum(1 for log in logs_with_anomalies if log.get("anomaly", 0) == -1)
            logger.debug(f"Detected {anomaly_count} anomalies in {len(logs_with_anomalies)} logs")
        except Exception as e:
            logger.error(f"Error in anomaly detection: {e}")
            return JSONResponse(
                status_code=500,
                content={"message": f"Error detecting anomalies: {str(e)}"}
            )
        
        # Extract anomaly details
        try:
            anomaly_details = [
                {
                    "timestamp": log.get("timestamp"),
                    "ip": log.get("ip"),
                    "method": log.get("method"),
                    "url": log.get("url"),
                    "status_code": log.get("status_code"),
                    "anomaly_score": log.get("anomaly_score")
                }
                for log in logs_with_anomalies if log.get("anomaly", 0) == -1
            ]
        except Exception as e:
            logger.error(f"Error extracting anomaly details: {e}")
            return JSONResponse(
                status_code=500,
                content={"message": f"Error processing anomaly details: {str(e)}"}
            )
        
        # Add logs to buffer and ChromaDB (if not empty)
        if logs_with_anomalies:
            try:
                global log_buffer
                log_buffer.extend(logs_with_anomalies)
                store_result = store_logs_in_chromadb(logs_with_anomalies)
                logger.debug(f"Stored logs in ChromaDB: {store_result}")
            except Exception as e:
                logger.error(f"Error storing logs: {e}")
                # Don't return error here, continue processing
        
        # Get historical context from log buffer
        historical_logs = log_buffer[-100:]  # Get last 100 logs for context
        
        # Check if we need to generate a summary (asynchronously)
        asyncio.create_task(process_logs_and_generate_summary())
        
        # Prepare response
        response = {
            "current_analysis": {
                "total_logs": len(logs_with_anomalies),
                "anomalies_detected": anomaly_count,
                "anomaly_details": anomaly_details,
                "logs_with_features": logs_with_anomalies,
            },
            "historical_context": {
                "total_logs_in_buffer": len(log_buffer),
                "recent_logs": historical_logs,
            },
            "prediction_time": (datetime.now() - start_time).total_seconds()
        }
        
        logger.debug(f"Completed anomaly detection request in {response['prediction_time']} seconds")
        return response
    
    except Exception as e:
        logger.error(f"Error in anomaly detection endpoint: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"message": f"Error: {str(e)}"}
        )

@app.get("/logs")
async def get_logs(limit: int = 100, anomaly_only: bool = False, query: str = None):
    """Retrieve logs from ChromaDB with optional filtering
    
    This endpoint provides access to historical log data stored in ChromaDB.
    Parameters:
    - limit: Maximum number of logs to retrieve (default 100)
    - anomaly_only: If true, returns only anomalous logs (default false)
    - query: Optional search query to filter logs
    """
    try:
        # Prepare query parameters
        where_filter = {}
        if anomaly_only:
            where_filter["anomaly_label"] = -1
        
        # Query ChromaDB
        results = logs_col.query(
            query_texts=query if query else None,
            n_results=limit,
            where=where_filter if where_filter else None
        )
        
        # Parse results
        logs = []
        
        if results['documents'] and len(results['documents'][0]) > 0:
            for i in range(len(results['documents'][0])):
                try:
                    # Extract the log from the document string
                    log_str = results['documents'][0][i]
                    log_data = eval(log_str)  # Convert string representation back to dict
                    
                    # Add metadata
                    if results['metadatas'] and len(results['metadatas'][0]) > i:
                        metadata = results['metadatas'][0][i]
                        log_data['stored_at'] = metadata.get('stored_at')
                    
                    logs.append(log_data)
                except Exception as e:
                    logger.error(f"Error parsing log result {i}: {e}")
        
        # Sort by timestamp (newest first)
        logs.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
        return {
            "total": len(logs),
            "logs": logs
        }
    
    except Exception as e:
        logger.error(f"Error retrieving logs: {e}")
        return JSONResponse(
            status_code=500,
            content={"message": f"Error retrieving logs: {str(e)}"}
        )

# === WebSocket Routes ===
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    client_id = str(uuid.uuid4())[:8]  # Generate a short client ID for logging
    logger.info(f"Client {client_id} connected via WebSocket")
    
    try:
        while True:
            # Receive and parse the message
            data = await websocket.receive_text()
            logger.debug(f"Received data from client {client_id}: {data[:100]}...")
            
            try:
                message = json.loads(data)
                logger.info(f"Client {client_id} sent message type: {message.get('type', 'unknown')}")
                
                if message["type"] == "auth":
                    # Handle authentication
                    api_key = message.get("apiKey")
                    if not api_key:
                        logger.warning(f"Client {client_id} authentication failed: No API key provided")
                        await websocket.send_json({"type": "error", "message": "API key not provided"})
                    else:
                        # In a real implementation, you'd validate the API key
                        # For now, we'll accept any key
                        logger.info(f"Client {client_id} authenticated successfully")
                        await websocket.send_json({"type": "auth_success", "message": "Authenticated successfully"})
                
                elif message["type"] == "log":
                    # Handle log message
                    log_data = message.get("log", {})
                    
                    if log_data:
                        logger.info(f"Received log from client {client_id}: {str(log_data)[:100]}...")
                        
                        # Process the log data
                        processed_log = prepare_log_features(log_data)
                        
                        # Add to buffer
                        log_buffer.append(processed_log)
                        logger.debug(f"Added log to buffer. Current buffer size: {len(log_buffer)}")
                        
                        # Store in ChromaDB
                        store_logs_in_chromadb([processed_log])
                        
                        # Check if we need to generate a summary
                        await process_logs_and_generate_summary()
                        
                        # Acknowledge receipt
                        await websocket.send_json({"type": "log_received", "message": "Log received and processed"})
                        logger.debug(f"Sent acknowledgment to client {client_id}")
                else:
                    logger.warning(f"Client {client_id} sent unknown message type: {message.get('type', 'unknown')}")
                    
            except json.JSONDecodeError:
                logger.error(f"Client {client_id} sent invalid JSON data")
                await websocket.send_json({"type": "error", "message": "Invalid JSON format"})
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info(f"Client {client_id} disconnected")
    except Exception as e:
        logger.error(f"WebSocket error for client {client_id}: {e}", exc_info=True)
        manager.disconnect(websocket)

# === Modified WebSocket endpoint to explicitly handle application backend connections ===
@app.websocket("/ws/application")
async def application_websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint specifically for the application backend"""
    await manager.connect(websocket)
    app_client_id = str(uuid.uuid4())[:8]  # Generate a short client ID for logging
    logger.info(f"🔗 Application backend {app_client_id} connected via WebSocket")
    print(f"\n{'='*50}\n🔗 APPLICATION BACKEND {app_client_id} CONNECTED\n{'='*50}\n")
    
    try:
        while True:
            # Receive and parse the message from application backend
            data = await websocket.receive_text()
            logger.info(f"📦 RECEIVED DATA FROM APPLICATION BACKEND {app_client_id}: {data[:200]}...")
            print(f"\n📦 RECEIVED DATA FROM APPLICATION BACKEND: {data[:200]}...\n")
            
            try:
                message = json.loads(data)
                logger.info(f"📝 Application {app_client_id} message type: {message.keys() if isinstance(message, dict) else 'not a dict'}")
            except json.JSONDecodeError as e:
                logger.error(f"❌ JSON decode error from application backend: {e}")
                print(f"\n❌ JSON DECODE ERROR: {e}\n")
                await websocket.send_json({"type": "error", "message": "Invalid JSON format"})
                continue
            
            # Process log data from application backend
            if isinstance(message, dict) and "logs" in message:
                # Handle batch logs
                logs_batch = message["logs"]
                logger.info(f"📚 Received batch of {len(logs_batch)} logs from application backend {app_client_id}")
                
                processed_logs = []
                for log in logs_batch:
                    processed_log = prepare_log_features(log)
                    processed_logs.append(processed_log)
                    log_buffer.append(processed_log)
                
                # Process for anomalies and broadcast results
                logs_with_anomalies = detect_anomalies(processed_logs)
                
                # Transform logs to include is_anomaly flag
                for log in logs_with_anomalies:
                    log["is_anomaly"] = log.get("anomaly", 0) == -1
                    # Keep anomaly_score but remove the raw anomaly value
                    log.pop("anomaly", None)
                
                anomaly_count = sum(1 for log in logs_with_anomalies if log["is_anomaly"])
                
                # Convert timestamps before sending
                response_data = {
                    "type": "logs_received",
                    "logs": logs_with_anomalies,
                    "total_logs": len(logs_with_anomalies),
                    "anomalies_detected": anomaly_count
                }
                
                # Convert any timestamps in the response to ISO format
                response_data = convert_timestamps_to_iso(response_data)
                
                # Send response with detailed log information
                await websocket.send_json(response_data)
                
                # Store in ChromaDB
                if processed_logs:
                    store_result = store_logs_in_chromadb(logs_with_anomalies)
                    logger.info(f"💾 Stored {len(processed_logs)} logs in ChromaDB: {store_result}")
                
                # Check if we need to generate a summary
                await process_logs_and_generate_summary()
            
            elif isinstance(message, dict) and "log" in message:
                # Handle single log
                log_data = message["log"]
                processed_log = prepare_log_features(log_data)
                
                # Process for anomalies
                log_with_anomaly = detect_anomalies([processed_log])
                
                # Transform to include is_anomaly flag
                if log_with_anomaly:
                    log_with_anomaly[0]["is_anomaly"] = log_with_anomaly[0].get("anomaly", 0) == -1
                    log_with_anomaly[0].pop("anomaly", None)
                
                # Add to buffer and store
                log_buffer.append(processed_log)
                store_result = store_logs_in_chromadb(log_with_anomaly)
                
                # Convert timestamps before sending
                response_data = {
                    "type": "log_received",
                    "log": log_with_anomaly[0] if log_with_anomaly else processed_log,
                    "is_anomaly": log_with_anomaly[0]["is_anomaly"] if log_with_anomaly else False
                }
                
                # Convert any timestamps in the response to ISO format
                response_data = convert_timestamps_to_iso(response_data)
                
                # Send response
                await websocket.send_json(response_data)
                
                # Check if we need to generate a summary
                await process_logs_and_generate_summary()
            else:
                logger.warning(f"⚠️ Unrecognized message format from application backend {app_client_id}: {message.keys() if isinstance(message, dict) else type(message)}")
                print(f"\n⚠️ UNRECOGNIZED MESSAGE FORMAT: {message.keys() if isinstance(message, dict) else type(message)}\n")
                await websocket.send_json({
                    "type": "error",
                    "message": "Unrecognized message format. Expected 'logs' or 'log' field."
                })
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info(f"🔌 Application backend {app_client_id} disconnected")
        print(f"\n{'='*50}\n🔌 APPLICATION BACKEND {app_client_id} DISCONNECTED\n{'='*50}\n")
    except Exception as e:
        logger.error(f"❌ Error in application WebSocket for client {app_client_id}: {e}", exc_info=True)
        print(f"\n❌ ERROR IN APPLICATION WEBSOCKET: {e}\n")
        manager.disconnect(websocket)

# === Background Tasks ===
@app.on_event("startup")
async def startup_event():
    # Start background processing
    asyncio.create_task(background_processing())
    logger.info("Started background processing")

async def background_processing():
    """Background task to process logs and generate summaries"""
    while True:
        await process_logs_and_generate_summary()
        await asyncio.sleep(10)  # Check every 10 seconds

# === Main Function ===
if __name__ == "__main__":
    print("runnig")
    uvicorn.run("main:app", host="0.0.0.0", port=SERVER_PORT, reload=True)