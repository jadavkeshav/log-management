import React from 'react';
import { BarChart2 } from 'lucide-react';
import { Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StatusCodeChart({ data }) {
  const STATUS_COLORS = {
    200: '#10B981', // Success - Green
    201: '#3B82F6', // Created - Blue
    400: '#F59E0B', // Bad Request - Orange
    401: '#EF4444', // Unauthorized - Red
    403: '#EF4444', // Forbidden - Red
    404: '#EF4444', // Not Found - Red
    500: '#7C3AED', // Server Error - Purple
  };

  const chartData = Array.isArray(data) ? data.map(item => ({
    name: `${item._id}`,
    value: item.count,
    color: STATUS_COLORS[item._id] || '#6B7280'
  })) : [];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const getStatusCodeDescription = (code) => {
    const descriptions = {
      200: 'OK',
      201: 'Created',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Server Error'
    };
    return descriptions[code] || 'Unknown';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <BarChart2 className="h-6 w-6 text-blue-500" />
        <h3 className="ml-2 text-lg font-medium">Status Code Distribution</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              tickFormatter={(value) => `${value}`}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis />
            <Tooltip
              formatter={(value, name, props) => [
                `${value} requests (${((value / total) * 100).toFixed(1)}%)`,
                `Status ${props.payload.name}`
              ]}
              labelStyle={{ color: '#111827' }}
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem'
              }}
            />
            <Bar 
              dataKey="value"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatusCodeChart;