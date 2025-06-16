import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FeatureCard from "../components/FeatureCard";

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-700 via-blue-600 to-blue-800 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32"
        >
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight tracking-tight">
              Empower Your Apps with Real-Time Log Streaming
            </h1>
            <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
              Logger-Mon delivers seamless log capture and analytics, empowering businesses to monitor application performance in real-time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/getting-started"
                className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
              >
                Get Started Now
              </Link>
              <Link
                to="/docs"
                className="px-8 py-4 bg-transparent border-2 border-white font-semibold rounded-xl hover:bg-indigo-700 hover:border-indigo-700 hover:shadow-lg transition-all duration-300 text-lg text-white"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </motion.div>
        <div className="h-20 bg-gradient-to-b from-blue-800 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16 text-gray-800 tracking-tight"
          >
            Transform How You Monitor Applications
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <FeatureCard
                icon="🔑"
                title="Secure, API-key Based Middleware"
                description="Authenticate and protect your logs with individual API keys. Ensure secure data handling and easy project management."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FeatureCard
                icon="⚡"
                title="Real-time Log Streaming"
                description="Capture logs in real-time with no delay. Our WebSocket-based solution provides immediate visibility into your application’s performance."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FeatureCard
                icon="📊"
                title="Data-Driven Insights"
                description="Leverage the power of GROQ models to unlock valuable insights from your logs. Visualize your data with customizable dashboards."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16 text-gray-800 tracking-tight"
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <pre className="text-sm text-indigo-800 font-mono bg-indigo-50/50 p-4 rounded-lg overflow-x-auto">
                  {`// Install the package
npm install logger-mon

// Integrate with your Express app
const logger = require('logger-mon');

app.use(logger({
  apiKey: process.env.LOGGER_API_KEY
}));

// That's it! Logs are now streaming!`}
                </pre>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Effortless Integration</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Logger-Mon was designed with simplicity in mind. With just a few lines of code, you can start streaming logs to your backend, enabling real-time monitoring and analysis.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Forget the hassle of complex configurations. Logger-Mon makes it easy for your development team to get started quickly and efficiently.
              </p>
              <Link
                to="/getting-started"
                className="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Your Integration
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-800 to-blue-700 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-4xl font-bold mb-6 tracking-tight">
            Elevate Your Application Monitoring
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-100">
            Join leading organizations who trust Logger-Mon for reliable, scalable log monitoring and analytics. Take control of your logs today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Create Your Account
            </Link>
            <Link
              to="/docs"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-indigo-700 hover:border-indigo-700 hover:shadow-lg transition-all duration-300 text-lg"
            >
              Explore Documentation
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
