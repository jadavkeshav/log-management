import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ProjectCard from './components/ProjectCard';
import ProjectDetails from './components/ProjectDetails';
import NewProjectModal from './components/NewProjectModal';

// Dummy data
const dummyProjects = [
  {
    id: 1,
    name: "E-commerce API",
    description: "RESTful API for online store",
    routes: [
      { path: "/api/products", method: "GET", avgResponseTime: 120 },
      { path: "/api/orders", method: "POST", avgResponseTime: 250 },
      { path: "/api/users", method: "GET", avgResponseTime: 80 },
    ],
    stats: {
      realtimeLogs: 1250,
      anomalies: 23,
      dbLogs: 456
    },
    trafficData: [
      { time: "00:00", requests: 30 },
      { time: "01:00", requests: 25 },
      { time: "02:00", requests: 40 },
      { time: "03:00", requests: 45 },
    ],
    recentLogs: [
      { timestamp: "2024-03-15T10:30:00Z", level: "info", message: "GET /api/products 200", source: "Web Server" },
      { timestamp: "2024-03-15T10:29:55Z", level: "warn", message: "Slow query detected", source: "Database" },
      { timestamp: "2024-03-15T10:29:50Z", level: "error", message: "Invalid user token", source: "Auth Service" },
    ]
  },
  {
    id: 2,
    name: "Blog Platform",
    description: "Content management system",
    routes: [
      { path: "/api/posts", method: "GET", avgResponseTime: 150 },
      { path: "/api/comments", method: "POST", avgResponseTime: 180 },
    ],
    stats: {
      realtimeLogs: 850,
      anomalies: 12,
      dbLogs: 234
    },
    trafficData: [
      { time: "00:00", requests: 20 },
      { time: "01:00", requests: 35 },
      { time: "02:00", requests: 30 },
      { time: "03:00", requests: 25 },
    ],
    recentLogs: [
      { timestamp: "2024-03-15T10:30:00Z", level: "info", message: "GET /api/posts 200", source: "Web Server" },
      { timestamp: "2024-03-15T10:29:45Z", level: "info", message: "New comment created", source: "Web Server" },
    ]
  }
];

function App() {
  const [projects, setProjects] = useState(dummyProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    routes: []
  });

  const handleCreateProject = () => {
    if (newProject.name && newProject.description) {
      const project = {
        id: projects.length + 1,
        ...newProject,
        stats: {
          realtimeLogs: 0,
          anomalies: 0,
          dbLogs: 0
        },
        trafficData: [],
        recentLogs: []
      };
      setProjects([...projects, project]);
      setNewProject({ name: '', description: '', routes: [] });
      setShowNewProjectModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{"width": "100vw"}}>
      <Navigation onNewProject={() => setShowNewProjectModal(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedProject ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={setSelectedProject}
              />
            ))}
          </div>
        ) : (
          <ProjectDetails
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
          />
        )}
      </main>

      {showNewProjectModal && (
        <NewProjectModal
          project={newProject}
          onClose={() => setShowNewProjectModal(false)}
          onCreate={handleCreateProject}
          onChange={setNewProject}
        />
      )}
    </div>
  );
}

export default App;