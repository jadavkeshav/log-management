import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Clock, Database } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [logs, setLogs] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [stats, setStats] = useState({
    realtimeLogs: 0,
    anomalies: 0,
    dbLogs: 0
  });

  useEffect(() => {
    // Fetch initial logs and stats
    fetch('http://localhost:3000/api/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs || []);
        setStats(data.stats || { realtimeLogs: 0, anomalies: 0, dbLogs: 0 });
        setTrafficData(data.trafficData || []);
      })
      .catch(console.error);

    // Set up WebSocket connection
    const ws = new WebSocket('ws://localhost:3000');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'initial') {
        setLogs(data.data.logs || []);
        setStats(data.data.stats || { realtimeLogs: 0, anomalies: 0, dbLogs: 0 });
        setTrafficData(data.data.trafficData || []);
      } else if (data.type === 'log') {
        setLogs(prevLogs => [data.log, ...prevLogs].slice(0, 100));
        
        // Update stats
        setStats(prevStats => ({
          ...prevStats,
          realtimeLogs: prevStats.realtimeLogs + 1,
          anomalies: data.log.level === 'warn' ? prevStats.anomalies + 1 : prevStats.anomalies,
          dbLogs: data.log.source === 'Database' ? prevStats.dbLogs + 1 : prevStats.dbLogs
        }));

        // Update traffic data
        const hour = new Date(data.log.timestamp).getHours() + ':00';
        setTrafficData(prevData => {
          const existingHourIndex = prevData.findIndex(d => d.time === hour);
          if (existingHourIndex >= 0) {
            const newData = [...prevData];
            newData[existingHourIndex] = {
              ...newData[existingHourIndex],
              requests: newData[existingHourIndex].requests + 1
            };
            return newData;
          }
          return [...prevData, { time: hour, requests: 1 }];
        });
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 containe" style={{"width": "100vw"}}>
      <nav className="bg-white shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-semibold">Log Management System</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-blue-500" />
              <h3 className="ml-2 text-lg font-medium">Real-time Logs</h3>
            </div>
            <p className="mt-2 text-3xl font-semibold">{stats.realtimeLogs}</p>
            <p className="text-gray-500">Last 24 hours</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="ml-2 text-lg font-medium">Anomalies</h3>
            </div>
            <p className="mt-2 text-3xl font-semibold">{stats.anomalies}</p>
            <p className="text-gray-500">Detected today</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Database className="h-6 w-6 text-green-500" />
              <h3 className="ml-2 text-lg font-medium">Database Logs</h3>
            </div>
            <p className="mt-2 text-3xl font-semibold">{stats.dbLogs}</p>
            <p className="text-gray-500">Slow queries today</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Request Traffic</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Logs Table */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium">Recent Logs</h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{log.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{log.level}</td>
                      <td className="px-6 py-4 text-sm">{log.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{log.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;