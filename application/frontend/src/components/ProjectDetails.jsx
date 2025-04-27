import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { GitBranch, ClipboardCopy, Check } from 'lucide-react';
import StatsOverview from './StatsOverview';
import RouteAnalysis from './RouteAnalysis';
import TrafficChart from './TrafficChart';
import PieGraph from './PieGraph';
import StatusCodeDistribution from './StatusCodeDistribution';
import LogMetrics from './LogMetrics';
import LiveLogs from './LiveLogs';

function ProjectDetails({ project, onBack }) {
  const [copied, setCopied] = useState(false);
  const [yearlyData, setYearlyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [statusCodes, setStatusCodes] = useState({});
  const [methods, setMethods] = useState([]);
  const [stats, setStats] = useState({ realtimeLogs: 0, anomalies: 0, dbLogs: 0 });
  const [metrics, setMetrics] = useState({
    avgBytes: 0,
    maxBytes: 0,
    anomalyCount: 0,
    totalRequests: 0
  });
  const [liveLogs, setLiveLogs] = useState([]);
  const [wsStatus, setWsStatus] = useState('connecting');

  const handleNewLog = useCallback((log) => {
    // Update live logs
    setLiveLogs(prev => [log, ...prev.slice(0, 98)]);

    // Update metrics with proper byte calculations
    setMetrics(prev => {
      const newTotal = prev.totalRequests + 1;
      const bytes = parseInt(log.bytesSent) || 0;
      return {
        avgBytes: Math.round(((prev.avgBytes * prev.totalRequests) + bytes) / newTotal),
        maxBytes: Math.max(prev.maxBytes, bytes),
        anomalyCount: prev.anomalyCount + (log.isAnomaly ? 1 : 0),
        totalRequests: newTotal
      };
    });

    // Update status codes
    setStatusCodes(prev => ({
      ...prev,
      [log.statusCode]: (prev[log.statusCode] || 0) + 1
    }));

    // Update methods
    setMethods(prev => {
      const methodIndex = prev.findIndex(m => m._id === log.method);
      if (methodIndex >= 0) {
        const updated = [...prev];
        updated[methodIndex] = {
          ...updated[methodIndex],
          count: updated[methodIndex].count + 1
        };
        return updated;
      }
      return [...prev, { _id: log.method, count: 1 }];
    });

    // Update stats
    setStats(prev => ({
      ...prev,
      realtimeLogs: prev.realtimeLogs + 1,
      anomalies: prev.anomalies + (log.isAnomaly ? 1 : 0)
    }));
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(sessionStorage.getItem("user"))?.token;
      if (!token) return;

      try {
        const endpoints = [
          'get-yearly-logs-overview',
          'get-monthly-logs-overview',
          'get-top-endpoints',
          'get-status-code-distribution',
          'get-method-distribution'
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint =>
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/analytics/${endpoint}`, {
              headers: {
                "Authorization": `Bearer ${token}`,
                "x-ford": project.apiKey
              }
            })
          )
        );

        responses.forEach((response, index) => {
          const data = response.data.data;
          switch (endpoints[index]) {
            case 'get-yearly-logs-overview':
              setYearlyData(data);
              break;
            case 'get-monthly-logs-overview':
              setMonthlyData(data);
              break;
            case 'get-top-endpoints':
              setEndpoints(data);
              break;
            case 'get-status-code-distribution':
              setStatusCodes(
                data.reduce((acc, curr) => ({
                  ...acc,
                  [curr._id]: curr.count
                }), {})
              );
              break;
            case 'get-method-distribution':
              setMethods(data);
              break;
          }
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchData();
  }, [project.apiKey]);

  // WebSocket connection
  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("user"))?.token;
    if (!token || !project.apiKey) return;

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
    const socket = new WebSocket(`${wsUrl}/ws`);

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({
        type: 'auth',
        apiKey: project.apiKey,
        token: token
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'error') {
        console.error('WebSocket error:', data.message);
        return;
      }

      if (data.type === 'initial_logs') {
        // Calculate initial metrics from historical logs
        const initialMetrics = data.logs.reduce((acc, log) => {
          const bytes = parseInt(log.bytesSent) || 0;
          return {
            avgBytes: acc.avgBytes + bytes,
            maxBytes: Math.max(acc.maxBytes, bytes),
            anomalyCount: acc.anomalyCount + (log.isAnomaly ? 1 : 0),
            totalRequests: acc.totalRequests + 1
          };
        }, { avgBytes: 0, maxBytes: 0, anomalyCount: 0, totalRequests: 0 });

        initialMetrics.avgBytes = Math.round(initialMetrics.avgBytes / initialMetrics.totalRequests) || 0;
        setMetrics(initialMetrics);
        setLiveLogs(data.logs);
        return;
      }

      if (data.type === 'log') {
        handleNewLog(data.log);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(() => {
        setWsStatus('connecting');
      }, 5000);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [project.apiKey, handleNewLog]);

  const handleCopy = () => {
    navigator.clipboard.writeText(project.apiKey);
    setCopied(true);
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
        <button
          onClick={handleCopy}
          className="ml-4 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition"
        >
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

      <LogMetrics metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusCodeDistribution data={statusCodes} />
        <PieGraph data={methods} />
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Traffic Overview</h2>
      <TrafficChart data={yearlyData} />

      <h2 className="text-xl font-bold mt-8 mb-4">Top Endpoints</h2>
      <RouteAnalysis data={endpoints} />

      <h2 className="text-xl font-bold mt-8 mb-4">Live Log Stream</h2>
      <LiveLogs logs={liveLogs} />
    </div>
  );
}

export default ProjectDetails;
