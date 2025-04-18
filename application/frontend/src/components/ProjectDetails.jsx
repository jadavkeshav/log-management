import React, { useState } from 'react';
import { GitBranch, ClipboardCopy, Check } from 'lucide-react';
import StatsOverview from './StatsOverview';
import RouteAnalysis from './RouteAnalysis';
import TrafficChart from './TrafficChart';
import RecentLogs from './RecentLogs';

function ProjectDetails({ project, onBack }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(project.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

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

      {/* API Key Display */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center justify-between">
        <div className="overflow-hidden">
          <p className="text-sm text-gray-600 mb-1 font-medium">API Key</p>
          <code className="text-blue-600 font-mono break-all">{project.apiKey}</code>
        </div>
        <button
          onClick={handleCopy}
          className="ml-4 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* <StatsOverview stats={project.stats} />
      <RouteAnalysis routes={project.routes} />
      <TrafficChart data={project.trafficData} />
      <RecentLogs logs={project.recentLogs} /> */}
    </div>
  );
}

export default ProjectDetails;
