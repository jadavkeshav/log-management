import React from 'react';
import { Menu, Plus, Home, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-2 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-100"
      >
        <Menu className="h-6 w-6" />
      </button>

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-40"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center mb-8">
            <h2 className="text-xl font-bold">Menu</h2>
          </div>

          <nav className="space-y-4">
            <Link
              to="/"
              onClick={toggleSidebar}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Home className="h-5 w-5 text-gray-600" />
              <span>View All Projects</span>
            </Link>

            {/* <button
              onClick={() => {
                onNewProject();
                toggleSidebar();
              }}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
            >
              <Plus className="h-5 w-5 text-gray-600" />
              <span>New Project</span>
            </button> */}

            <Link
              to="/chatbot"
              onClick={toggleSidebar}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-gray-600" />
              <span>Chatbot</span>
            </Link>
          </nav>
        </div>
      </motion.div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

export default Sidebar;

