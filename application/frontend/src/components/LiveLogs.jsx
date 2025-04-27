import React, { useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

function LiveLogs({ logs }) {
  const tableEndRef = useRef(null);

  useEffect(() => {
    tableEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Activity className="h-6 w-6 text-blue-500" />
          <h3 className="ml-2 text-lg font-medium">Live Logs</h3>
        </div>
        <span className="text-sm text-gray-500">
          Total Logs: {logs.length}
        </span>
      </div>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bytes</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <tr 
                key={log.timestamp + index} 
                className={`${log.isAnomaly ? 'bg-red-50' : ''} 
                  ${index === 0 ? 'animate-highlight' : ''}`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {log.ip}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    log.method === 'GET' ? 'bg-green-100 text-green-800' :
                    log.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                    log.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                    log.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {log.method}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {log.url}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    log.statusCode < 300 ? 'bg-green-100 text-green-800' :
                    log.statusCode < 400 ? 'bg-yellow-100 text-yellow-800' :
                    log.statusCode < 500 ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {log.statusCode}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {log.bytesSent} B
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {log.protocol}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {log.isAnomaly && (
                    <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      Anomaly
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div ref={tableEndRef} />
      </div>
    </div>
  );
}

export default LiveLogs;