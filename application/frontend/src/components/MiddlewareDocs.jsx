// import React from "react";
// import { Link } from "react-router-dom";

// const MiddlewareDocs = () => {
// 	return (
// 		<div className="bg-gray-100 text-gray-800 min-h-screen">
// 			<header className="bg-white shadow p-6">
// 				<h1 className="text-3xl font-bold text-center text-blue-700">Logger-Mon Documentation</h1>
// 				<p className="text-center text-sm text-gray-500 mt-2">Seamlessly capture and stream logs to your backend</p>
// 			</header>

// 			<main className="max-w-5xl mx-auto p-6">
// 				<section className="mb-10">
// 					<h2 className="text-2xl font-semibold text-blue-600 mb-2">📦 What is Logger-Mon?</h2>
// 					<p>
// 						<code>logger-mon</code> is a lightweight, zero-dependency JavaScript middleware designed for capturing and forwarding client-side logs to a centralized server using WebSocket. It helps developers monitor applications efficiently in real-time.
// 					</p>
// 				</section>

// 				<section className="mb-10">
// 					<h2 className="text-2xl font-semibold text-blue-600 mb-2">⚙️ Prerequisites</h2>
// 					<ul className="list-disc list-inside">
// 						<li>A Node.js project</li>
// 						<li>
// 							<code>.env</code> file configured with your backend URL and API key
// 						</li>
// 						<li>
// 							Access to your <strong>server-backend</strong> endpoint
// 						</li>
// 						<li>An API key obtained after creating an account and setting up a project</li>
// 					</ul>
// 				</section>

// 				<section className="mb-10">
// 					<h2 className="text-2xl font-semibold text-blue-600 mb-2">⬇️ Installation</h2>
// 					<pre className="bg-gray-200 p-4 rounded text-sm overflow-x-auto">npm install logger-mon</pre>
// 				</section>

// 				<section className="mb-10">
// 					<h2 className="text-2xl font-semibold text-blue-600 mb-2">🔑 Getting Your API Key</h2>
// 					<ol className="list-decimal list-inside space-y-2">
// 						<li>
// 							Go to{" "}
// 							<Link to={"/login"} className="text-blue-500 underline">
// 								logger-mon backend
// 							</Link>
// 							.
// 						</li>
// 						<li>Create an account and sign in.</li>
// 						<li>
// 							Navigate to the <strong>Projects</strong> section and click <strong>Create Project</strong>.
// 						</li>
// 						<li>
// 							Copy the generated <strong>API Key</strong>.
// 						</li>
// 						<li>
// 							Paste it into your <code>.env</code> or use it directly in your code.
// 						</li>
// 					</ol>
// 				</section>

// 				<section className="mb-10">
// 					<h2 className="text-2xl font-semibold text-blue-600 mb-2">🚀 Usage</h2>
// 					<p className="mb-4">Add the middleware to your Node.js application and configure it using your API key and WebSocket endpoint:</p>
// 					<pre className="bg-gray-200 p-4 rounded text-sm overflow-x-auto">
// 						{`// app.js
// require('dotenv').config();
// const express = require('express');
// const logger = require('logger-mon');

// const app = express();

// app.use(
//   logger({
//     apiKey: process.env.LOGGER_API_KEY,
//   })
// );

// app.get('/', (req, res) => res.send('Logger-Mon is active'));

// app.listen(3000, () => console.log('Server running on port 3000'));`}
// 					</pre>
// 				</section>

// 				<section className="mb-10">
// 					<h2 className="text-2xl font-semibold text-blue-600 mb-2">📡 Log Transmission</h2>
// 					<p className="mb-2">All Incoming Request logs are intercepted and streamed in real-time to our Logger-Mon backend server via secure WebSocket.</p>
// 					<p>
// 						Each log is tagged with its respective <strong>workspace</strong> using the provided API key. Once stored, these logs are processed using <strong>GROQ models</strong> to generate powerful insights and visualizations, which can be accessed directly through your project’s dashboard.
// 					</p>
// 				</section>

// 				<section className="mb-10">
// 					<h2 className="text-2xl font-semibold text-blue-600 mb-2">🔒 Security</h2>
// 					<p>Ensure that API keys are kept secret and rotate them periodically. The backend server validates every message to prevent abuse or spoofing.</p>
// 				</section>

// 				<section className="mb-20">
// 					<h2 className="text-2xl font-semibold text-blue-600 mb-2">❓ Support</h2>
// 					<p>
// 						For issues, contributions, or feature requests, visit the{" "}
// 						<a href="https://github.com/jadavkeshav/log-management" className="text-blue-500 underline">
// 							GitHub repository
// 						</a>
// 						.
// 					</p>
// 				</section>
// 			</main>

// 			<footer className="bg-white shadow p-4 text-center text-gray-500 text-sm">&copy; 2025 Logger-Mon</footer>
// 		</div>
// 	);
// };

// export default MiddlewareDocs;

import React from "react";
import { Link } from "react-router-dom";
import CodeBlock from "./CodeBlock";
const MiddlewareDocs = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 min-h-screen font-sans">
      <header className="bg-white shadow-lg py-8 px-6 sticky top-0 z-10">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 tracking-tight">
          Logger-Mon Documentation
        </h1>
        <p className="text-center text-base text-gray-600 mt-3 font-medium">
          Seamlessly capture and stream logs to your backend
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <section className="mb-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-4 flex items-center">
            <span className="mr-2">📦</span> What is Logger-Mon?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">
              logger-mon
            </code>{" "}
            is a lightweight, zero-dependency JavaScript middleware designed for
            capturing and forwarding client-side logs to a centralized server
            using WebSocket. It helps developers monitor applications
            efficiently in real-time.
          </p>
        </section>

        <section className="mb-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-4 flex items-center">
            <span className="mr-2">⚙️</span> Prerequisites
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>A Node.js project</li>
            <li>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                .env
              </code>{" "}
              file configured with your backend URL and API key
            </li>
            <li>
              Access to your <strong>server-backend</strong> endpoint
            </li>
            <li>
              An API key obtained after creating an account and setting up a
              project
            </li>
          </ul>
        </section>

        <section className="mb-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-4 flex items-center">
            <span className="mr-2">⬇️</span> Installation
          </h2>
          {/* <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg text-sm font-mono overflow-x-auto"> */}
          <CodeBlock language="bash">npm install logger-mon</CodeBlock>
          {/* </pre> */}
        </section>

        <section className="mb-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-4 flex items-center">
            <span className="mr-2">🔑</span> Getting Your API Key
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              Go to{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 underline transition-colors"
              >
                logger-mon backend
              </Link>
              .
            </li>
            <li>Create an account and sign in.</li>
            <li>
              Navigate to the <strong>Projects</strong> section and click{" "}
              <strong>Create Project</strong>.
            </li>
            <li>
              Copy the generated <strong>API Key</strong>.
            </li>
            <li>
              Paste it into your{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                .env
              </code>{" "}
              or use it directly in your code.
            </li>
          </ol>
        </section>

        <section className="mb-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-4 flex items-center">
            <span className="mr-2">🚀</span> Usage
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Add the middleware to your Node.js application and configure it
            using your API key and WebSocket endpoint:
          </p>
          {/* <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg text-sm font-mono overflow-x-auto"> */}
          <CodeBlock language="javascript">
            {`// app.js
require('dotenv').config();
const express = require('express');
const logger = require('logger-mon');

const app = express();

app.use(
  logger({
    apiKey: process.env.LOGGER_API_KEY,
  })
);

app.get('/', (req, res) => res.send('Logger-Mon is active'));

app.listen(3000, () => console.log('Server running on port 3000'));`}
            {/* </pre> */}
          </CodeBlock>
        </section>

        <section className="mb-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-4 flex items-center">
            <span className="mr-2">📡</span> Log Transmission
          </h2>
          <p className="mb-3 text-gray-700 leading-relaxed">
            All Incoming Request logs are intercepted and streamed in real-time
            to our Logger-Mon backend server via secure WebSocket.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Each log is tagged with its respective <strong>workspace</strong>{" "}
            using the provided API key. Once stored, these logs are processed
            using <strong>GROQ models</strong> to generate powerful insights and
            visualizations, which can be accessed directly through your
            project’s dashboard.
          </p>
        </section>

        <section className="mb-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-4 flex items-center">
            <span className="mr-2">🔒</span> Security
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Ensure that API keys are kept secret and rotate them periodically.
            The backend server validates every message to prevent abuse or
            spoofing.
          </p>
        </section>

        <section className="mb-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-4 flex items-center">
            <span className="mr-2">❓</span> Support
          </h2>
          <p className="text-gray-700 leading-relaxed">
            For issues, contributions, or feature requests, visit the{" "}
            <a
              href="https://github.com/jadavkeshav/log-management"
              className="text-blue-600 hover:text-blue-800 underline transition-colors"
            >
              GitHub repository
            </a>
            .
          </p>
        </section>
      </main>

      <footer className="bg-white shadow-inner py-6 px-4 text-center text-gray-600 text-sm font-medium">
        © 2025 Logger-Mon. All rights reserved.
      </footer>
    </div>
  );
};

export default MiddlewareDocs;
