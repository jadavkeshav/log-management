import React from 'react';
import { GitBranch } from 'lucide-react';
import StatsOverview from './StatsOverview';
import RouteAnalysis from './RouteAnalysis';
import TrafficChart from './TrafficChart';
import RecentLogs from './RecentLogs';

function ProjectDetails({ project, onBack }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <GitBranch className="h-8 w-8 text-blue-500" />
          <div className="ml-3">
            <h2 className="text-2xl font-bold">{project.name}</h2>
            <p className="text-gray-500">{project.description}</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700"
        >
          Back to Projects
        </button>
      </div>

      <StatsOverview stats={project.stats} />
      <RouteAnalysis routes={project.routes} />
      <TrafficChart data={project.trafficData} />
      <RecentLogs logs={project.recentLogs} />
    </div>
  );
}

export default ProjectDetails;