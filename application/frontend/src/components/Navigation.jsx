import React from 'react';
import { Activity, Plus } from 'lucide-react';
import Login from './Login';
function Navigation({ onNewProject }) {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-xl font-semibold">Log Analysis Dashboard</span>
          </div>
          <button
            onClick={onNewProject}
            className="inline-flex items-center px-6 py-3 border-2 border-blue-600 rounded-lg shadow-lg 
            text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 
            hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 
            transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5 mr-2 animate-pulse" />
            <span className="tracking-wide">New Project</span>
          </button>
        </div>
      </div>
	  <Login />
    </nav>
  );
}

export default Navigation;