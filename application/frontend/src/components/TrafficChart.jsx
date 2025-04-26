// import React from 'react';
// import { BarChart3 } from 'lucide-react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// function TrafficChart({ data }) {
//   console.log(data);
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center mb-4">
//         <BarChart3 className="h-6 w-6 text-blue-500" />
//         <h3 className="ml-2 text-lg font-medium">Request Traffic</h3>
//       </div>
//       <div className="h-80">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="time" />
//             <YAxis />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey="requests"
//               stroke="#3B82F6"
//               strokeWidth={2}
//             />
//           </LineChart>
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
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <BarChart3 className="h-6 w-6 text-blue-500" />
        <h3 className="ml-2 text-lg font-medium">Request Methods Distribution</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="method" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} requests`, 'Total']}
              labelFormatter={(label) => `Method: ${label}`}
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