import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

function StatusCodeDistribution({ data }) {
  // Transform object data into array format for Recharts
  const chartData = Object.entries(data || {}).map(([code, count]) => ({
    statusCode: code,
    count: count,
    color: code.startsWith('2') ? '#10B981' : // 2xx - Green
           code.startsWith('3') ? '#F59E0B' : // 3xx - Yellow
           code.startsWith('4') ? '#EF4444' : // 4xx - Red
           '#6B7280'                          // 5xx and others - Gray
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <BarChart3 className="h-6 w-6 text-blue-500" />
        <h3 className="ml-2 text-lg font-medium">Status Code Distribution</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="statusCode" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} requests`, 'Count']}
              labelFormatter={(label) => `Status ${label}`}
            />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              fill="#3B82F6"
              fillOpacity={0.8}
            >
              {chartData.map((entry, index) => (
                <Bar
                  key={index}
                  fill={entry.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatusCodeDistribution;