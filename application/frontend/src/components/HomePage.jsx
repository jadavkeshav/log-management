import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";

const HomePage = () => {
	return (
		<div className="bg-gray-50 min-h-screen">
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
					<div className="text-center max-w-3xl mx-auto">
						<h1 className="text-5xl font-bold mb-6 leading-tight">Empower Your Applications with Real-time Log Streaming</h1>
						<p className="text-lg md:text-2xl mb-8 text-blue-100">Logger-Mon provides seamless log capture and analytics, enabling businesses to monitor application performance in real-time.</p>
						<div className="flex flex-col sm:flex-row justify-center gap-6">
							<Link to="/getting-started" className="px-8 py-4 bg-white text-blue-800 font-medium rounded-md hover:bg-blue-50 transition-colors text-xl">
								Get Started Now
							</Link>
							<Link to="/docs" className="px-8 py-4 bg-transparent border-2 border-white font-medium rounded-md hover:bg-blue-700 hover:border-blue-700 transition-colors text-xl" style={{ color: "white" }}>
								View Documentation
							</Link>
						</div>
					</div>
				</div>
				<div className="h-20 bg-gradient-to-b from-blue-900 to-transparent"></div>
			</section>

			{/* Features Section */}
			<section className="py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-4xl font-semibold text-center mb-12 text-gray-800">Transform How You Monitor Applications</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<FeatureCard icon="🔑" title="Secure, API-key Based Middleware" description="Authenticate and protect your logs with individual API keys for each project. Ensure secure data handling and easy project management." />
						<FeatureCard icon="⚡" title="Real-time Log Streaming" description="Capture logs in real-time with no delay. Our WebSocket-based solution provides immediate visibility into your application’s performance." />
						<FeatureCard icon="📊" title="Data-Driven Insights" description="Leverage the power of GROQ models to unlock valuable insights from your logs. Visualize your data with customizable dashboards." />
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-4xl font-semibold text-center mb-12 text-gray-800">How It Works</h2>
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-lg">
								<pre className="text-sm text-blue-800 overflow-x-auto">
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
						</div>
						<div>
							<h3 className="text-2xl font-semibold mb-4 text-gray-800">Effortless Integration</h3>
							<p className="text-gray-600 mb-4">Logger-Mon was designed with simplicity in mind. With just a few lines of code, you can start streaming logs to your backend, enabling real-time monitoring and analysis.</p>
							<p className="text-gray-600 mb-4">Forget the hassle of complex configurations. Logger-Mon makes it easy for your development team to get started quickly and efficiently.</p>
							<Link to="/getting-started" className="inline-block px-8 py-4 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 transition-colors" style={{ color: "white" }} >
								Start Your Integration
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-blue-800 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-4xl font-bold mb-6">Elevate Your Application Monitoring</h2>
					<p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">Join leading organizations who trust Logger-Mon for reliable, scalable log monitoring and analytics. Take control of your logs today.</p>
					<div className="flex flex-col sm:flex-row justify-center gap-6">
						<Link to="/signup" className="px-8 py-4 bg-white text-blue-800 font-medium rounded-md hover:bg-blue-50 transition-colors text-xl">
							Create Your Account
						</Link>
						<Link to="/docs" className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-blue-700 hover:border-blue-700 transition-colors text-xl" style={{ color: "white" }}>
							Explore Documentation
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
