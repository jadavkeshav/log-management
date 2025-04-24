const FeatureCard = ({ icon, title, description }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg">
        <div className="text-blue-600 mb-4 text-3xl">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    )
  }
  
  export default FeatureCard
  