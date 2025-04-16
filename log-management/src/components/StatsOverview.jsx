import React from 'react';
import { Clock, AlertTriangle, Database } from 'lucide-react';

function StatsOverview({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
  );
}

export default StatsOverview;