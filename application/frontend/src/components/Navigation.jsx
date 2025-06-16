import React, { useState } from 'react';
import { Activity, Plus, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { logOutUser, lookInSession } from '../utils/session';
import Sidebar from './Sidebar';

function Navigation({ onNewProject, isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logOutUser();
    onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-xl sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Activity className="h-9 w-9 text-blue-600 transition-transform hover:scale-110 duration-300" />
            <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors">
              LoggerMon
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              to="/docs"
              className="text-gray-700 hover:text-blue-600 font-medium text-sm tracking-wide transition-colors duration-200"
            >
              Docs
            </Link>
            <Link
              to="/getting-started"
              className="text-gray-700 hover:text-blue-600 font-medium text-sm tracking-wide transition-colors duration-200"
            >
              Getting Started
            </Link>
            {isAuthenticated ? (
              <>
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <button
                  onClick={onNewProject}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Plus className="h-5 w-5 mr-2 animate-pulse" />
                  New Project
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;