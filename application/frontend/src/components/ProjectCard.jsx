import React, { useState, useEffect } from "react";
import { logOutUser, lookInSession, removeFromSession, storeIsSession } from "../utils/session";
import { FolderPlus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

function ProjectCard({ project, onClick, userAuth, fetchProjects }) {
  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent card click
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/workspaces/${project._id}`, {
      method: 'DELETE',
      body: JSON.stringify({
        user: userAuth.user
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userAuth.token}`
      }
    });
    if (response.ok) {
      toast.success("Project deleted successfully!");
    } else {
      toast.error("Project deletion failed!");
    }
    fetchProjects();
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl duration-300 relative overflow-hidden border border-gray-100"
    >
      <div className="flex items-center mb-4" onClick={() => onClick(project)}>
        <FolderPlus className="h-8 w-8 text-blue-600 flex-shrink-0 transition-transform hover:scale-110 duration-200" />
        <div className="ml-4 flex-1">
          <h3 className="text-xl font-bold text-gray-900 truncate">
            {project?.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {project?.description || "No description provided"}
          </p>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-4 right-4 p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        title="Delete Project"
      >
        <Trash2 className="h-5 w-5 text-red-600 hover:text-red-700" />
      </button>
    </div>
  );
}

export default ProjectCard;