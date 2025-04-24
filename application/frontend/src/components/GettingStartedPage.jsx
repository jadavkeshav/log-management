import { Link } from "react-router-dom"
import CodeBlock from "./CodeBlock"

const GettingStartedPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Getting Started with Logger-Mon</h1>
        <p className="text-lg text-gray-600 mb-8">
          Follow this guide to quickly integrate Logger-Mon into your Node.js application and start streaming logs in
          real-time.
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Installation</h2>
          <p className="text-gray-600 mb-4">Install Logger-Mon using npm:</p>
          <CodeBlock language="bash">npm install logger-mon</CodeBlock>
          <p className="text-gray-600 mt-4">Or using yarn:</p>
          <CodeBlock language="bash">yarn add logger-mon</CodeBlock>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Configuration</h2>
          <p className="text-gray-600 mb-4">
            Create a <code>.env</code> file in your project root and add your Logger-Mon API key:
          </p>
          <CodeBlock language="env">
            # .env LOGGER_API_KEY=your_api_key_here BACKEND_URL=https://api.logger-mon.com
          </CodeBlock>
          <p className="text-gray-600 mt-4">
            Don't have an API key yet?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>{" "}
            to get one.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Usage</h2>
          <p className="text-gray-600 mb-4">Add the Logger-Mon middleware to your Express.js application:</p>
          <CodeBlock language="javascript">
            {`// app.js
require('dotenv').config();
const express = require('express');
const logger = require('logger-mon');

const app = express();

// Add the Logger-Mon middleware
app.use(
  logger({
    apiKey: process.env.LOGGER_API_KEY,
    // Optional: customize the backend URL if needed
    backendUrl: process.env.BACKEND_URL
  })
);

// Your routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`}
          </CodeBlock>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Advanced Configuration</h2>
          <p className="text-gray-600 mb-4">Logger-Mon supports additional configuration options:</p>
          <CodeBlock language="javascript">
            {`app.use(
  logger({
    apiKey: process.env.LOGGER_API_KEY,
    backendUrl: process.env.BACKEND_URL,
    
    // Only log specific request types
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    
    // Exclude certain paths from logging
    excludePaths: ['/health', '/metrics'],
    
    // Include request bodies in logs (default: false)
    logRequestBody: true,
    
    // Include response bodies in logs (default: false)
    logResponseBody: true,
    
    // Custom log formatter
    formatter: (req, res) => ({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: res.responseTime,
      // Add your custom fields here
    })
  })
);`}
          </CodeBlock>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Viewing Your Logs</h2>
          <p className="text-gray-600 mb-4">
            Once Logger-Mon is set up, your logs will be streamed to our backend in real-time. To view them:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>
              Log in to your{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Logger-Mon dashboard
              </Link>
            </li>
            <li>Select your project from the projects list</li>
            <li>Navigate to the "Logs" tab to see your real-time log stream</li>
            <li>Use the search and filter options to find specific logs</li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Need Help?</h2>
          <p className="text-blue-700 mb-4">
            If you encounter any issues or have questions, check out our{" "}
            <Link to="/docs" className="text-blue-600 font-medium hover:underline">
              documentation
            </Link>{" "}
            or reach out to our support team.
          </p>
          <a
            href="https://github.com/jadavkeshav/log-management"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </div>
  )
}

export default GettingStartedPage
