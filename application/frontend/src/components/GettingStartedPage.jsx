import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../components/CodeBlock.jsx';
import { 
  BookOpen, 
  Terminal, 
  Settings, 
  Eye, 
  HelpCircle, 
  Zap, 
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Monitor
} from 'lucide-react';

const GradientIcon = ({ icon: Icon, className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-sm opacity-75"></div>
    <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
      <Icon className="h-5 w-5 text-white" />
    </div>
  </div>
);

const Section = ({ icon: Icon, title, children, className = "" }) => (
  <div className={`group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 hover:shadow-xl hover:border-gray-200 transition-all duration-300 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative">
      <div className="flex items-center gap-4 mb-6">
        <GradientIcon icon={Icon} />
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  </div>
);

const StepIndicator = ({ number, active = false }) => (
  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-200 ${
    active 
      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
      : 'bg-gray-100 text-gray-500'
  }`}>
    {number}
  </div>
);

const ConfigOption = ({ title, description, code }) => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors duration-200">
    <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
    <p className="text-sm text-gray-600 mb-2">{description}</p>
    <code className="text-xs bg-white px-2 py-1 rounded border text-purple-600 font-mono">
      {code}
    </code>
  </div>
);

const GettingStartedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
                  <Monitor className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Logger-Mon
              </span>
              <br />
              <span className="text-3xl sm:text-4xl text-gray-700 font-semibold">
                Getting Started
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Integrate real-time log streaming into your Node.js application in minutes. 
              Monitor, debug, and analyze your application logs with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dashboard"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Zap className="h-5 w-5" />
                Quick Start
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="https://github.com/jadavkeshav/log-management"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Demo
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 pb-20">
        {/* Installation */}
        <Section icon={Terminal} title="Installation">
          <p className="text-gray-600 mb-6 text-lg">
            Get started by installing Logger-Mon via your preferred package manager:
          </p>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">NPM</h4>
              <CodeBlock language="bash">npm install logger-mon</CodeBlock>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Yarn</h4>
              <CodeBlock language="bash">yarn add logger-mon</CodeBlock>
            </div>
          </div>
        </Section>

        {/* Configuration */}
        <Section icon={Settings} title="Environment Setup">
          <p className="text-gray-600 mb-6 text-lg">
            Configure your environment variables to connect with Logger-Mon's backend:
          </p>
          <CodeBlock language="env">
{`# .env
LOGGER_API_KEY=your_api_key_here
BACKEND_URL=https://api.logger-mon.com
NODE_ENV=production`}
          </CodeBlock>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-800 font-medium">Need an API key?</p>
                <p className="text-blue-700 text-sm mt-1">
                  Sign up for a free account to get your API key and start monitoring your logs immediately.
                </p>
                <Link 
                  to="/signup"
                  className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Get API Key →
                </Link>
              </div>
            </div>
          </div>
        </Section>

        {/* Basic Usage */}
        <Section icon={BookOpen} title="Basic Integration">
          <p className="text-gray-600 mb-6 text-lg">
            Add Logger-Mon middleware to your Express application:
          </p>
          <CodeBlock language="javascript">
{`require('dotenv').config();
const express = require('express');
const logger = require('logger-mon');

const app = express();

// Add Logger-Mon middleware
app.use(
  logger({
    apiKey: process.env.LOGGER_API_KEY,
    backendUrl: process.env.BACKEND_URL,
  })
);

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});`}
          </CodeBlock>
        </Section>

        {/* Advanced Configuration */}
        <Section icon={Settings} title="Advanced Configuration">
          <p className="text-gray-600 mb-6 text-lg">
            Customize Logger-Mon's behavior with these configuration options:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <ConfigOption 
              title="HTTP Methods"
              description="Specify which HTTP methods to log"
              code="methods: ['GET', 'POST', 'PUT']"
            />
            <ConfigOption 
              title="Exclude Paths"
              description="Skip logging for specific routes"
              code="excludePaths: ['/health', '/metrics']"
            />
            <ConfigOption 
              title="Request Body"
              description="Include request body in logs"
              code="logRequestBody: true"
            />
            <ConfigOption 
              title="Response Body"
              description="Include response body in logs"
              code="logResponseBody: true"
            />
          </div>

          <CodeBlock language="javascript">
{`app.use(
  logger({
    apiKey: process.env.LOGGER_API_KEY,
    backendUrl: process.env.BACKEND_URL,
    
    // Advanced options
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    excludePaths: ['/health', '/metrics', '/favicon.ico'],
    logRequestBody: true,
    logResponseBody: true,
    maxBodySize: 1024, // KB
    
    // Custom formatter
    formatter: (req, res) => ({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: res.responseTime,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    })
  })
);`}
          </CodeBlock>
        </Section>

        {/* Viewing Logs */}
        <Section icon={Eye} title="Viewing Your Logs">
          <p className="text-gray-600 mb-6 text-lg">
            Access your real-time logs through the Logger-Mon dashboard:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <StepIndicator number={1} active />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Login to Dashboard</h4>
                <p className="text-gray-600 text-sm">Access your Logger-Mon account and navigate to the dashboard.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <StepIndicator number={2} active />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Select Project</h4>
                <p className="text-gray-600 text-sm">Choose your project from the list of connected applications.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <StepIndicator number={3} active />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Monitor Logs</h4>
                <p className="text-gray-600 text-sm">View real-time logs, search, filter, and analyze your application data.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link 
              to="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Open Dashboard
            </Link>
            <Link 
              to="/docs"
              className="px-6 py-3 bg-white text-gray-700 rounded-xl font-medium border border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              View Docs
            </Link>
          </div>
        </Section>

        {/* Help Section */}
        <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Need Help?</h2>
            </div>
            <p className="text-blue-100 mb-6 text-lg leading-relaxed">
              Our comprehensive documentation and support team are here to help you get the most out of Logger-Mon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/docs"
                className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Documentation
              </Link>
              <a 
                href="https://github.com/jadavkeshav/log-management"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20 flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                GitHub Repository
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedPage;