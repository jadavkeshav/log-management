import React from 'react';
import { X } from 'lucide-react';

function NewProjectModal({ project, onClose, onCreate, onChange }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-all shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Create New Project</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => onChange({ ...project, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
              transition-all duration-200 text-gray-900 text-base"
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={project.description}
              onChange={(e) => onChange({ ...project, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
              transition-all duration-200 text-gray-900 text-base resize-none"
              rows="4"
              placeholder="Describe your project"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg text-gray-700 font-semibold 
              hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onCreate}
              className="px-6 py-3 rounded-lg text-white font-semibold
              bg-gradient-to-r from-blue-600 to-blue-700 
              hover:from-blue-700 hover:to-blue-800
              transform hover:scale-105 transition-all duration-200
              shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewProjectModal;