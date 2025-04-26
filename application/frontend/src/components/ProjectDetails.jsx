import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { createContext } from "react";
import { GitBranch, ClipboardCopy, Check, PieChart } from 'lucide-react';
import StatsOverview from './StatsOverview';
import RouteAnalysis from './RouteAnalysis';
import TrafficChart from './TrafficChart';
import PieGraph from './PieGraph';
import RecentLogs from './RecentLogs';
import {
  lookInSession,
  removeFromSession,
  storeIsSession,
} from "../utils/session";

const UserContext = createContext({});
function ProjectDetails({ project, onBack }) {
  const [copied, setCopied] = useState(false);
  // const { userAuth } = useContext(UserContext);
  const [userAuth, setUserAuth] = useState({});
    // let userInSession = lookInSession("user");
  
    // userInSession
    //   ? setUserAuth(JSON.parse(userInSession))
    //   : setUserAuth({ token: null });
  const [yearlyData, setYearlyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [statusCodes, setStatusCodes] = useState([]);
  const [methods, setMethods] = useState([]);
  useEffect(() => { 
    const fetchData = () => {
      const token = JSON.parse(sessionStorage.getItem("user")).token || null;
      if (!token) return;
      axios
        .get(import.meta.env.VITE_BASE_URL + "/api/analytics/get-yearly-logs-overview", {
          headers: { "Authorization": `Bearer ${token}`, "x-ford": `${project.apiKey}`  },
        })
        .then((response) => {
          console.log("Log data fetched successfully:", response.data.data);
          setYearlyData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching log data:", error);
        });
        axios
        .get(import.meta.env.VITE_BASE_URL + "/api/analytics/get-monthly-logs-overview", {
          headers: { "Authorization": `Bearer ${token}`, "x-ford": `${project.apiKey}`  },
        })
        .then((response) => {
          console.log("Log data fetched successfully:", response.data.data);
          setMonthlyData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching log data:", error);
        });
        axios
        .get(import.meta.env.VITE_BASE_URL + "/api/analytics/get-top-endpoints", {
          headers: { "Authorization": `Bearer ${token}`, "x-ford": `${project.apiKey}`  },
        })
        .then((response) => {
          console.log("End points fetched successfully:", response.data.data);
          setEndpoints(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching log data:", error);
        });
        axios
        .get(import.meta.env.VITE_BASE_URL + "/api/analytics/get-status-code-distribution", {
          headers: { "Authorization": `Bearer ${token}`, "x-ford": `${project.apiKey}`  },
        })
        .then((response) => {
          console.log("Status codes fetched successfully:", response.data.data);
          setStatusCodes(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching log data:", error);
        });
        axios
        .get(import.meta.env.VITE_BASE_URL + "/api/analytics/get-method-distribution", {
          headers: { "Authorization": `Bearer ${token}`, "x-ford": `${project.apiKey}`  },
        })
        .then((response) => {
          console.log("Methods fetched successfully:", response.data.data);
          setMethods(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching log data:", error);
        });
    };
    fetchData();
  }, []);
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
          style={{ "background-color": "blue" }}
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
      <h2 style={{"font-size": "20px"}}><b>Yearly Logs</b></h2>
      <TrafficChart data={yearlyData} />
      <h2 style={{"font-size": "20px"}}><b>Monthly Logs</b></h2>
      <TrafficChart data={monthlyData} />
      <h2 style={{"font-size": "20px"}}><b>Methods</b></h2>
      <PieGraph data={methods} />
      {/* <StatsOverview stats={project.stats} />
      <RouteAnalysis routes={project.routes} />
      <TrafficChart data={project.trafficData} />
      <RecentLogs logs={project.recentLogs} /> */}
    </div>
  );
}

export default ProjectDetails;
