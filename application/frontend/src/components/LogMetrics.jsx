import React from 'react';
import { FileBarChart, AlertTriangle, Network } from 'lucide-react';

function LogMetrics({ metrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <FileBarChart className="h-6 w-6 text-blue-500" />
          <h3 className="ml-2 text-lg font-medium">Average Bytes</h3>
        </div>
        <p className="mt-2 text-3xl font-semibold">
          {metrics?.avgBytes?.toFixed(2) || 0}
        </p>
        <p className="text-gray-500">bytes/request</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Network className="h-6 w-6 text-green-500" />
          <h3 className="ml-2 text-lg font-medium">Max Bytes</h3>
        </div>
        <p className="mt-2 text-3xl font-semibold">
          {metrics?.maxBytes || 0}
        </p>
        <p className="text-gray-500">bytes</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <h3 className="ml-2 text-lg font-medium">Anomaly Rate</h3>
        </div>
        <p className="mt-2 text-3xl font-semibold">
          {((metrics?.anomalyCount || 0) / (metrics?.totalRequests || 1) * 100).toFixed(1)}%
        </p>
        <p className="text-gray-500">of total requests</p>
      </div>
    </div>
  );
}

export default LogMetrics;