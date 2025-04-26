
// import React from 'react';
// import { BarChart3 } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// function TrafficChart({ data }) {
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center mb-4">
//         <BarChart3 className="h-6 w-6 text-blue-500" />
//         <h3 className="ml-2 text-lg font-medium">Request Methods Distribution</h3>
//       </div>
//       <div className="h-80">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="method" />
//             <YAxis />
//             <Tooltip 
//               formatter={(value) => [`${value} requests`, 'Total']}
//               labelFormatter={(label) => `Method: ${label}`}
//             />
//             <Bar 
//               dataKey="totalLogs" 
//               fill="#3B82F6" 
//               radius={[4, 4, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

// export default TrafficChart;






import React from 'react';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TrafficChart({ data }) {
  // Generate full year data
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const fullYearData = months.map((month, index) => {
    const monthNumber = index + 1;
    const matchingData = Array.isArray(data) ? 
      data.find(d => d.month === monthNumber && d.year === 2025) : 
      (data?.month === monthNumber && data?.year === 2025 ? data : null);

    return {
      month,
      totalLogs: matchingData?.totalLogs || 0
    };
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <BarChart3 className="h-6 w-6 text-blue-500" />
        <h3 className="ml-2 text-lg font-medium">Yearly Log Distribution (2025)</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={fullYearData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} logs`, 'Total']}
              labelFormatter={(label) => `${label} 2025`}
            />
            <Bar 
              dataKey="totalLogs" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TrafficChart;