import React from 'react';
import { LucidePieChart } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function StatusCodeDistribution({ data }) {
  const COLORS = {
    '2xx': '#10B981', // Green for success
    '3xx': '#F59E0B', // Yellow for redirects
    '4xx': '#EF4444', // Red for client errors
    '5xx': '#6B7280'  // Gray for server errors
  };
  
  const formatted = Object.entries(data || {}).map(([code, count]) => ({
    name: code,
    value: count,
    color: COLORS[`${code[0]}xx`] || '#6B7280'
  }));

  const total = formatted.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <LucidePieChart className="h-6 w-6 text-blue-500" />
        <h3 className="ml-2 text-lg font-medium text-black">Status Code Distribution</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsChart>
            <Pie
              data={formatted}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {formatted.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [
                `${value} requests (${((value / total) * 100).toFixed(1)}%)`,
                'Count'
              ]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => `${value} - ${formatted.find(item => item.name === value)?.value || 0} requests`}
            />
          </RechartsChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatusCodeDistribution;