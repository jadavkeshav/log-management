import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { GitBranch, ClipboardCopy, Check } from "lucide-react";
import TrafficChart from "./TrafficChart";
import RouteAnalysis from "./RouteAnalysis";
import StatusCodeDistribution from "./StatusCodeDistribution";
import LiveLogStream from "./LiveLogStream";
import LogMetrics from "./LogMetrics";
import { lookInSession, removeFromSession, storeIsSession } from "../utils/session";
import toast from "react-hot-toast";
import PieGraph from "./PieGraph";
import { data } from "react-router-dom";

function ProjectDetails({ project, onBack }) {
	const [copied, setCopied] = useState(false);
	const [yearlyData, setYearlyData] = useState([]);
	const [monthlyData, setMonthlyData] = useState([]);
	const [endpoints, setEndpoints] = useState([]);
	const [statusCodes, setStatusCodes] = useState({});
	const [methods, setMethods] = useState([]);
	const [liveLogs, setLiveLogs] = useState([]);
	const [anamoly, setAnalomy] = useState(false);
	const [metrics, setMetrics] = useState({
		avgBytes: 0,
		maxBytes: 0,
		anomalyPercentage: 0,
		totalRequests: 0,
	});
	const [data, setData] = useState({});
	const [lastThreeminutesLogs, setLastThreeMinutesLogs] = useState([]);
	const handleNewLog = useCallback((log) => {
		setLiveLogs((prev) => {
			const newLogs = [...prev, log].slice(-100); // Keep last 100 logs

			// Update metrics
			const bytes = parseInt(log.bytesSent) || 0;
			const totalRequests = newLogs.length;
			const avgBytes = Math.round(newLogs.reduce((acc, l) => acc + (parseInt(l.bytesSent) || 0), 0) / totalRequests);
			const maxBytes = Math.max(...newLogs.map((l) => parseInt(l.bytesSent) || 0));
			const anomalies = newLogs.filter((l) => l.is_anomaly).length;

			// setMetrics({
			// 	avgBytes,
			// 	maxBytes,
			// 	anomalyPercentage: (anomalies / totalRequests) * 100,
			// 	totalRequests,
			// });

			// Update status codes
			setStatusCodes((prev) => {
				const newCodes = { ...prev };
				newCodes[log.statusCode] = (newCodes[log.statusCode] || 0) + 1;
				return newCodes;
			});

			return newLogs;
		});
	}, []);

	useEffect(() => {
		const token = JSON.parse(sessionStorage.getItem("user"))?.token;
		if (!token) return;

		const headers = {
			Authorization: `Bearer ${token}`,
			"x-ford": project.apiKey,
		};

		// Fetch initial analytics data
		const fetchData = () => {
			axios
				.get(import.meta.env.VITE_BASE_URL + "/api/analytics/get-yearly-logs-overview", { headers })
				.then((response) => setYearlyData(response.data.data))
				.catch((error) => console.error("Error fetching yearly data:", error));

			axios
				.get(import.meta.env.VITE_BASE_URL + "/api/analytics/get-monthly-logs-overview", { headers })
				.then((response) => setMonthlyData(response.data.data))
				.catch((error) => console.error("Error fetching monthly data:", error));

			axios
				.get(import.meta.env.VITE_BASE_URL + "/api/analytics/get-top-endpoints", { headers })
				.then((response) => setEndpoints(response.data.data))
				.catch((error) => console.error("Error fetching endpoints:", error));

			axios
				.get(import.meta.env.VITE_BASE_URL + "/api/analytics/get-status-code-distribution", { headers })
				.then((response) => setStatusCodes(response.data.data))
				.catch((error) => console.error("Error fetching status codes:", error));

			axios
				.get(import.meta.env.VITE_BASE_URL + "/api/analytics/get-method-distribution", { headers })
				.then((response) => setMethods(response.data.data))
				.catch((error) => console.error("Error fetching methods:", error));

			axios
				.get(import.meta.env.VITE_BASE_URL + "/api/analytics/", { headers })
				.then((response) => {
					// setData(response.data.data)
					if (response.data.data.anomaly_summary.anomalies_detected == 1) {
						setAnalomy(true);
					} else {
						setAnalomy(false);
					}
					console.log("data  : ", response);
				})
				.catch((error) => console.error("Error fetching methods:", error));

			axios
				.get(import.meta.env.VITE_BASE_URL + "/api/analytics/get-overview", { headers })
				.then((response) => {
					const { avgBytesSent, maxBytesSent, anomalyPercentage, totalRequests } = response.data.data;
					console.log("first metrics  : ", response.data.data);
					setMetrics({
						avgBytes: avgBytesSent,
						maxBytes: maxBytesSent,
						anomalyPercentage,
						totalRequests,
					});
					// console.log("metrics  : ", metrics)
				})
				.catch((error) => console.error("Error fetching overview metrics:", error));

			axios
				.get(import.meta.env.VITE_BASE_URL + "/api/analytics/get-last-three-mins-logs", { headers })
				.then((response) => {
					setLastThreeMinutesLogs(response.data.data);
					console.log("last three minutes logs  : ", response.data.data);
				})
				.catch((error) => console.error("Error fetching last three minutes logs:", error));
		};

		fetchData();
		const dataInterval = setInterval(fetchData, 5000);

		// WebSocket connection for live updates
		const wsUrl = import.meta.env.VITE_BASE_URL.replace("http", "ws") + "/ws";
		const socket = new WebSocket("ws://127.0.0.1:5000/ws");

		socket.onopen = () => {
			socket.send(
				JSON.stringify({
					type: "auth",
					apiKey: project.apiKey,
				})
			);
		};

		socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === "initial_logs") {
					// Calculate initial metrics from historical logs
					// const initialMetrics = data.logs.reduce(
					// 	(acc, log) => {
					// 		const bytes = parseInt(log.bytesSent) || 0;
					// 		return {
					// 			avgBytes: acc.avgBytes + bytes,
					// 			maxBytes: Math.max(acc.maxBytes, bytes),
					// 			anomalyPercentage: acc.anomalyPercentage + (log.is_anomaly ? 1 : 0),
					// 			totalRequests: acc.totalRequests + 1,
					// 		};
					// 	},
					// 	{ avgBytes: 0, maxBytes: 0, anomalyPercentage: 0, totalRequests: 0 }
					// );

					// initialMetrics.avgBytes = Math.round(initialMetrics.avgBytes / initialMetrics.totalRequests) || 0;
					// initialMetrics.anomalyPercentage = (initialMetrics.anomalyPercentage / initialMetrics.totalRequests) * 100;
					// setMetrics(initialMetrics);
					setLiveLogs(data.logs);
				} else if (data.type === "log") {
					handleNewLog(data.log);
				}
			} catch (error) {
				console.error("Error processing WebSocket message:", error);
			}
		};

		socket.onerror = (error) => {
			console.error("WebSocket error:", error);
			toast.error("Connection error. Retrying...");
		};

		return () => {
			clearInterval(dataInterval);
			socket.close();
		};
	}, [project.apiKey, handleNewLog]);

	console.log(statusCodes);
	const handleCopy = () => {
		navigator.clipboard.writeText(project.apiKey);
		setCopied(true);
		toast.success("API Key copied to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<GitBranch className="h-8 w-8 text-blue-500" />
					<div className="ml-3">
						<h2 className="text-2xl font-bold">{project.name}</h2>
						<p className="text-gray-500">{project.description}</p>
					</div>
				</div>
				<button onClick={onBack} className="text-gray-500 hover:text-gray-700">
					Back to Projects
				</button>
			</div>

			<div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center justify-between">
				<div className="overflow-hidden">
					<p className="text-sm text-gray-600 mb-1 font-medium">API Key</p>
					<code className="text-blue-600 font-mono break-all">{project.apiKey}</code>
				</div>
				<button onClick={handleCopy} className="ml-4 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition">
					{copied ? (
						<>
							<Check className="h-4 w-4 mr-2" />
							Copied
						</>
					) : (
						<>
							<ClipboardCopy className="h-4 w-4 mr-2" />
							Copy
						</>
					)}
				</button>
			</div>

			{metrics.avgBytes && <LogMetrics data={metrics} anamoly={anamoly} />}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div>
					<h2 className="text-xl font-semibold mb-4">Request Distribution</h2>
					<TrafficChart data={yearlyData} />
				</div>
				<div>
					<h2 className="text-xl font-semibold mb-4">Status Code Distribution</h2>
					<StatusCodeDistribution data={statusCodes} />
				</div>
			</div>

			<div>
				<h2 className="text-xl font-semibold mb-4">HTTP Method Distribution</h2>
				<PieGraph data={methods} />
			</div>

			<div>
				<h2 className="text-xl font-semibold mb-4">Live Log Stream <span className="text-gray-500"> ( * Recent 3 Minute only )</span></h2>
				<LiveLogStream data={lastThreeminutesLogs} />
			</div>
		</div>
	);
}

export default ProjectDetails;
