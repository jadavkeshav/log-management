import React from 'react';
import { BarChart2, ArrowUp, AlertTriangle, Activity } from 'lucide-react';
  function LogMetrics({ data , anamoly }) {
    
    console.log("LogMetrics data:", data);

    // const logs = data?.data || [];
    // const formatBytes = (bytes) => {
    //   if (bytes === 0) return '0 B';
    //   const k = 1024;
    //   const sizes = ['B', 'KB', 'MB', 'GB'];
    //   const i = Math.floor(Math.log(bytes) / Math.log(k));
    //   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    // };
  
  // Calculate statistics
  // const stats = {
  //   totalRequests: logs.length,
  //   avgBytes: Math.round(logs.reduce((acc, log) => acc + parseInt(log.bytesSent), 0) / logs.length),
  //   maxBytes: Math.max(...logs.map(log => parseInt(log.bytesSent))),
  //   anomalies: logs.filter(log => log.is_anomaly).length
  // };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <BarChart2 className="h-6 w-6 text-blue-500" />
          <h3 className="ml-2 text-lg font-medium">Avg. Bytes/Request</h3>
        </div>
        <p className="mt-2 text-xl font-semibold">{data.avgBytes}</p>
        <p className="text-gray-500">Average response size</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <ArrowUp className="h-6 w-6 text-green-500" />
          <h3 className="ml-2 text-lg font-medium">Max Response</h3>
        </div>
        <p className="mt-2 text-xl font-semibold">{data.maxBytes}</p>
        <p className="text-gray-500">Largest response</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          <h3 className="ml-2 text-lg font-medium">Anomalies</h3>
        </div>
        <p className={`mt-2 text-xl font-semibold ${anamoly ? "text-red-500" : "text-green-500"}`}>{anamoly ? "Recently Anamoly Detected" : "No Anomalies Detected"}</p>
        <p className="text-gray-500"></p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Activity className="h-6 w-6 text-purple-500" />
          <h3 className="ml-2 text-lg font-medium">Total Requests</h3>
        </div>
        <p className="mt-2 text-xl font-semibold">{data.totalRequests}</p>
        <p className="text-gray-500">All-time requests</p>
      </div>
    </div>
  );
}

export default LogMetrics;