# Log Management and Anomaly Detection System

## Overview
This repository contains a Log Management and Anomaly Detection system designed to process, analyze, and detect anomalies in server log data. The system provides an API to interact with log data, detect anomalies in real-time, and provide insights based on user queries. Additionally, it supports WebSocket communication for real-time log monitoring and analysis.

## Features
- **Log Management**: Manage server logs, including timestamp, IP, method, URL, status code, and other relevant details.
- **Anomaly Detection**: Use machine learning techniques like Isolation Forest to detect anomalies in incoming log data.
- **Chat Interface**: A query-based interface for users to ask questions related to log data and summaries.
- **WebSocket Support**: Real-time log monitoring and anomaly detection with WebSocket communication.
- **Integration with ChromaDB**: Stores logs for later processing and analysis in a vector database.
- **Asynchronous Log Summarization**: Automatically generate summaries of log data for efficient querying.


## API Endpoints
1. **`/` (GET)**  
    Returns a simple message indicating that the log management server is running.

2. **`/health` (GET)**  
    Health check endpoint to monitor the status of the server.  
    **Response**:  
    ```json
    {
      "status": "healthy",
      "timestamp": "current_time"
    }
    ```

3. **`/chat` (POST)**  
    Allows users to submit a query related to log data and receive an answer based on log summaries.  
    **Request Body**:  
    ```json
    {
      "query": "Your query here"
    }
    ```  
    **Response**:  
    ```json
    {
      "response": "Answer to your query"
    }
    ```

4. **`/anomaly_detection` (POST)**  
    Accepts a batch of log entries and returns anomaly detection results.  
    **Request Body**:  
    ```json
    {
      "logs": [
         {
            "ip": "192.168.1.1",
            "timestamp": "2025-04-01T12:34:56Z",
            "method": "GET",
            "url": "/api/v1/data",
            "status_code": 200,
            "bytes_sent": 500,
            "user_agent": "Mozilla/5.0"
         }
      ]
    }
    ```  
    **Response**:  
    ```json
    {
      "total_logs": 1,
      "anomalies_detected": 1,
      "anomaly_details": [
         {
            "timestamp": "2025-04-01T12:34:56Z",
            "ip": "192.168.1.1",
            "method": "GET",
            "url": "/api/v1/data",
            "status_code": 200,
            "anomaly_score": 0.85
         }
      ],
      "prediction_time": "0.02"
    }
    ```

5. **`/ws` (WebSocket)**  
    WebSocket endpoint for real-time log monitoring and anomaly detection. Sends anomaly detection updates and acknowledgments upon receiving logs.

6. **`/ws/application` (WebSocket)**  
    A specialized WebSocket endpoint for the application backend to send logs and receive anomaly updates.

## Installation

### Running the Frontend

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install Node modules 

```bash
npm i
```

3. Run the Development Server

```bash
npm run dev
```


### Running the Frontend

1. Navigate to backend directory
```bash
cd backend
```

2. Install Node modules 

```bash
npm i
```

3. Run the Development Server

```bash
npx nodemon server.js
```




### Prerequisites
- Python 3.11

### Install Dependencies
Install required dependencies using pip: 

```bash
pip install -r requirements.txt
```

### Running the Server
1. Navigate to server directory
```bash
cd server
```

2. Start the server:  
```bash
uvicorn server:app --reload
```

    This will start the FastAPI application, and the server will be available at `http://127.0.0.0.1:`.



## Real-time Monitoring with WebSockets
To connect to the WebSocket server for real-time updates, you can use any WebSocket client or implement one in your application.  