import React from 'react';
import { FolderPlus } from 'lucide-react';

function ProjectCard({ project, onClick }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-transform hover:scale-105"
      onClick={() => onClick(project)}
    >
      <div className="flex items-center mb-4">
        <FolderPlus className="h-8 w-8 text-blue-500" />
        <div className="ml-3">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="text-sm text-gray-500">{project.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{project.stats.realtimeLogs}</p>
          <p className="text-sm text-gray-500">Logs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{project.stats.anomalies}</p>
          <p className="text-sm text-gray-500">Anomalies</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{project.routes.length}</p>
          <p className="text-sm text-gray-500">Routes</p>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;