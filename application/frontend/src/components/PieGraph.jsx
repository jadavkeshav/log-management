import React from 'react';
import { PieChart as LucidePieChart } from 'lucide-react';
import { PieChart as RechartsChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function PieGraph({ data }) {
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1'];
  
  // Transform data to match Recharts format if needed
  const chartData = Array.isArray(data) ? data.map(item => ({
    name: item._id,
    value: item.count
  })) : [];

  // Calculate total for percentage
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <LucidePieChart className="h-6 w-6 text-blue-500" style={{ "color": "black" }} />
        <h3 className="ml-2 text-lg font-medium text-black" style={{ "color": "black" }}>HTTP Methods Distribution</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
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
              formatter={(value) => `${value} - ${chartData.find(item => item.name === value)?.value || 0} requests`}
            />
          </RechartsChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PieGraph;