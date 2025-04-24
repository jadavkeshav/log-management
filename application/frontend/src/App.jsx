// import React, { useState } from 'react';
// import Navigation from './components/Navigation';
// import ProjectCard from './components/ProjectCard';
// import ProjectDetails from './components/ProjectDetails';
// import NewProjectModal from './components/NewProjectModal';
// import axios from "axios"

// // Dummy data
// const dummyProjects = [
//   {
//     id: 1,
//     name: "E-commerce API",
//     description: "RESTful API for online store",
//     routes: [
//       { path: "/api/products", method: "GET", avgResponseTime: 120 },
//       { path: "/api/orders", method: "POST", avgResponseTime: 250 },
//       { path: "/api/users", method: "GET", avgResponseTime: 80 },
//     ],
//     stats: {
//       realtimeLogs: 1250,
//       anomalies: 23,
//       dbLogs: 456
//     },
//     trafficData: [
//       { time: "00:00", requests: 30 },
//       { time: "01:00", requests: 25 },
//       { time: "02:00", requests: 40 },
//       { time: "03:00", requests: 45 },
//     ],
//     recentLogs: [
//       { timestamp: "2024-03-15T10:30:00Z", level: "info", message: "GET /api/products 200", source: "Web Server" },
//       { timestamp: "2024-03-15T10:29:55Z", level: "warn", message: "Slow query detected", source: "Database" },
//       { timestamp: "2024-03-15T10:29:50Z", level: "error", message: "Invalid user token", source: "Auth Service" },
//     ]
//   },
//   {
//     id: 2,
//     name: "Blog Platform",
//     description: "Content management system",
//     routes: [
//       { path: "/api/posts", method: "GET", avgResponseTime: 150 },
//       { path: "/api/comments", method: "POST", avgResponseTime: 180 },
//     ],
//     stats: {
//       realtimeLogs: 850,
//       anomalies: 12,
//       dbLogs: 234
//     },
//     trafficData: [
//       { time: "00:00", requests: 20 },
//       { time: "01:00", requests: 35 },
//       { time: "02:00", requests: 30 },
//       { time: "03:00", requests: 25 },
//     ],
//     recentLogs: [
//       { timestamp: "2024-03-15T10:30:00Z", level: "info", message: "GET /api/posts 200", source: "Web Server" },
//       { timestamp: "2024-03-15T10:29:45Z", level: "info", message: "New comment created", source: "Web Server" },
//     ]
//   }
// ];

// function App() {
//   const [projects, setProjects] = useState(dummyProjects);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showNewProjectModal, setShowNewProjectModal] = useState(false);
//   const [newProject, setNewProject] = useState({
//     name: '',
//     description: '',
//     routes: []
//   });

//   const handleCreateProject = () => {
//     if (newProject.name && newProject.description) {
//       const project = {
//         id: projects.length + 1,
//         ...newProject,
//         stats: {
//           realtimeLogs: 0,
//           anomalies: 0,
//           dbLogs: 0
//         },
//         trafficData: [],
//         recentLogs: []
//       };
//       console.log(project)
//       setProjects([...projects, project]);
//       setNewProject({ name: '', description: '', routes: [] });
//       setShowNewProjectModal(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50" style={{"width": "100vw"}}>
//       <Navigation onNewProject={() => setShowNewProjectModal(true)} />

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {!selectedProject ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {projects.map(project => (
//               <ProjectCard
//                 key={project.id}
//                 project={project}
//                 onClick={setSelectedProject}
//               />
//             ))}
//           </div>
//         ) : (
//           <ProjectDetails
//             project={selectedProject}
//             onBack={() => setSelectedProject(null)}
//           />
//         )}
//       </main>

//       {showNewProjectModal && (
//         <NewProjectModal
//           project={newProject}
//           onClose={() => setShowNewProjectModal(false)}
//           onCreate={handleCreateProject}
//           onChange={setNewProject}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import ProjectCard from "./components/ProjectCard";
import ProjectDetails from "./components/ProjectDetails";
import NewProjectModal from "./components/NewProjectModal";
import Login from "./components/Login";
import Signup from "./components/Signup";
import axios from "axios";
import { createContext } from "react";
import { lookInSession, removeFromSession, storeIsSession } from "./utils/session";
import MiddlewareDocs from "./components/MiddleWareDocs";
import HomePage from "./components/HomePage";
import GettingStartedPage from "./components/GettingStartedPage";
// Dummy data
// const dummyProjects = [
// 	{
// 		id: 1,
// 		name: "E-commerce API",
// 		description: "RESTful API for online store",
// 		routes: [
// 			{ path: "/api/products", method: "GET", avgResponseTime: 120 },
// 			{ path: "/api/orders", method: "POST", avgResponseTime: 250 },
// 			{ path: "/api/users", method: "GET", avgResponseTime: 80 },
// 		],
// 		stats: {
// 			realtimeLogs: 1250,
// 			anomalies: 23,
// 			dbLogs: 456,
// 		},
// 		trafficData: [
// 			{ time: "00:00", requests: 30 },
// 			{ time: "01:00", requests: 25 },
// 			{ time: "02:00", requests: 40 },
// 			{ time: "03:00", requests: 45 },
// 		],
// 		recentLogs: [
// 			{ timestamp: "2024-03-15T10:30:00Z", level: "info", message: "GET /api/products 200", source: "Web Server" },
// 			{ timestamp: "2024-03-15T10:29:55Z", level: "warn", message: "Slow query detected", source: "Database" },
// 			{ timestamp: "2024-03-15T10:29:50Z", level: "error", message: "Invalid user token", source: "Auth Service" },
// 		],
// 	},
// 	{
// 		id: 2,
// 		name: "Blog Platform",
// 		description: "Content management system",
// 		routes: [
// 			{ path: "/api/posts", method: "GET", avgResponseTime: 150 },
// 			{ path: "/api/comments", method: "POST", avgResponseTime: 180 },
// 		],
// 		stats: {
// 			realtimeLogs: 850,
// 			anomalies: 12,
// 			dbLogs: 234,
// 		},
// 		trafficData: [
// 			{ time: "00:00", requests: 20 },
// 			{ time: "01:00", requests: 35 },
// 			{ time: "02:00", requests: 30 },
// 			{ time: "03:00", requests: 25 },
// 		],
// 		recentLogs: [
// 			{ timestamp: "2024-03-15T10:30:00Z", level: "info", message: "GET /api/posts 200", source: "Web Server" },
// 			{ timestamp: "2024-03-15T10:29:45Z", level: "info", message: "New comment created", source: "Web Server" },
// 		],
// 	},
// ];

const PrivateRoute = ({ children }) => {
	const { userAuth } = useContext(UserContext);
	return userAuth?.token ? children : <Navigate to="/" />;
};

const PublicRoute = ({ children }) => {
	const { userAuth } = useContext(UserContext);
	return userAuth?.token ? <Navigate to="/dashboard" /> : children;
};

export const UserContext = createContext({});

function App() {
	const [userAuth, setUserAuth] = useState({});

	const [projects, setProjects] = useState([]);
	const [selectedProject, setSelectedProject] = useState(null);
	const [showNewProjectModal, setShowNewProjectModal] = useState(false);
	const [newProject, setNewProject] = useState({
		name: "",
		description: "",
		routes: [],
	});

	useEffect(() => {
		let userInSession = lookInSession("user");

		userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ token: null });
	}, []);

	//updateProjects
	//fetch projects from backend method

	const fetchProjects = () => {
		if (!userAuth?.token) return;
		axios
			.get(import.meta.env.VITE_BASE_URL + "/api/workspaces/", { headers: { Authorization: `Bearer ${userAuth?.token}` } })
			.then((response) => {
				console.log("Projects fetched successfully:", response.data.data);
				setProjects(response.data.data);
			})
			.catch((error) => {
				console.error("Error fetching projects:", error);
			});
	};

	useEffect(() => {
		if (userAuth?.token) {
			fetchProjects();
		}
	}, [userAuth?.token]);

	useEffect(() => {
		console.log("Projects state updated:", projects);
	}, [projects]);

	const handleCreateProject = () => {
		if (newProject.name && newProject.description) {
			const project = {
				id: projects.length + 1,
				...newProject,
				stats: {
					realtimeLogs: 0,
					anomalies: 0,
					dbLogs: 0,
				},
				trafficData: [],
				recentLogs: [],
			};
			console.log(project);
			axios
				.post(
					import.meta.env.VITE_BASE_URL + "/api/workspaces",
					{
						name: project.name,
						description: project.description,
					},
					{ headers: { Authorization: `Bearer ${userAuth.token}` } }
				)
				.then((response) => {
					console.log("Project created successfully:", response.data);
					// Handle success (e.g., update state, show success message)
					fetchProjects();
				})
				.catch((error) => {
					console.error("Error creating project:", error);
					// Handle error (e.g., show error message)
				});
			setShowNewProjectModal(false);
		}
	};

	// setUserAuth(JSON.parse(lookInSession("user")));

	return (
		<Router>
			<div className="min-h-screen bg-gray-50" style={{ width: "100vw" }}>
				{/* <Navigation onNewProject={() => setShowNewProjectModal(true)} /> */}
				<Navigation
					isAuthenticated={!!lookInSession("user")}
					onNewProject={() => setShowNewProjectModal(true)}
					onLogout={() => {
						setUserAuth({ token: null });
						logOutUser();
						// optionally trigger logout logic or context update
					}}
				/>

				<UserContext.Provider value={{ userAuth, setUserAuth }}>
					{/* <Routes>
						<Route path="/" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						<Route
							path="/dashboard"
							element={
								<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
									{!selectedProject ? (
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
											{projects.map((project) => (
												<ProjectCard key={project.id} project={project} onClick={setSelectedProject} />
											))}
										</div>
									) : (
										<ProjectDetails project={selectedProject} onBack={() => setSelectedProject(null)} />
									)}
								</main>
							}
						/>
						<Route path="*" element={<Navigate to="/" />} />
					</Routes> */}
					<Routes>
						<Route
							path="/"
							element={
								<PublicRoute>
									<HomePage />
								</PublicRoute>
							}
						/>
						<Route
							path="/getting-started"
							element={
								<PublicRoute>
									<GettingStartedPage />
								</PublicRoute>
							}
						/>
						<Route
							path="/signin"
							element={
								<PublicRoute>
									<Login />
								</PublicRoute>
							}
						/>
						<Route
							path="/signup"
							element={
								<PublicRoute>
									<Signup />
								</PublicRoute>
							}
						/>
						<Route
							path="/dashboard"
							element={
								<PrivateRoute>
									<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{!selectedProject ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{projects && projects?.map((project) => <ProjectCard key={project._id} project={project} onClick={setSelectedProject} />)}</div> : <ProjectDetails project={selectedProject} onBack={() => setSelectedProject(null)} />}</main>
								</PrivateRoute>
							}
						/>
						{/* Catch all: redirect based on auth */}
						<Route
							path="/docs"
							element={
								<PublicRoute>
									<MiddlewareDocs />
								</PublicRoute>
							}
						/>
						<Route path="*" element={userAuth?.token ? <Navigate to="/dashboard" /> : <Navigate to="/" />} />
					</Routes>
					{userAuth?.token && showNewProjectModal && <NewProjectModal project={newProject} onClose={() => setShowNewProjectModal(false)} onCreate={handleCreateProject} onChange={setNewProject} />}
				</UserContext.Provider>
			</div>
		</Router>
	);
}

export default App;
