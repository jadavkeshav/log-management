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
    onLogout(); // Call the logout function passed as a prop
    navigate('/');// redirect to home
  };


  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-xl font-semibold">LoggerMon</span>
          </div>
          <div className="flex items-center space-x-4">
          <div>
            <Link to="/docs"><h5>Docs</h5></Link>
          </div>
          <div>
            <Link to="/getting-started"><h5>Getting Started</h5></Link>
          </div>
            {isAuthenticated ? (
              <>
                <Sidebar isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} />
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
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-6 py-3 border-2 border-red-600 rounded-lg 
                  text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 
                  hover:from-red-700 hover:to-red-800 transform hover:scale-105 
                  transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 
                  focus:ring-red-500 focus:ring-offset-2 shadow-lg"
                >
                  <LogOut className="h-5 w-5 mr-2 text-white" />
                  <span className="tracking-wide text-white"><b>Logout</b></span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="inline-flex items-center px-6 py-3 border-2 border-green-600 rounded-lg 
                  text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 
                  hover:from-green-700 hover:to-green-800 transform hover:scale-105 
                  transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 
                  focus:ring-green-500 focus:ring-offset-2 shadow-lg"
                >
                  <LogIn className="h-5 w-5 mr-2 text-white" />
                  <span className="tracking-wide text-white"><b>Login</b></span>
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-6 py-3 border-2 border-purple-600 rounded-lg 
                  text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 
                  hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 
                  transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 
                  focus:ring-purple-500 focus:ring-offset-2 shadow-lg"
                >
                  <UserPlus className="h-5 w-5 mr-2 text-white" />
                  <span className="tracking-wide text-white"><b>Sign Up</b></span>
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
