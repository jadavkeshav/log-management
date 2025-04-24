// import React from "react";
// import { SendHorizontal } from 'lucide-react';
// const Chatbot = ({ projects }) => {
//   return (
//     <div className="min-w-screen overflow-hidden flex text-white">
//       <div className="flex-1 flex flex-col">
//         {/* Tab Bar */}

//         {/* Copilot Panel */}
//         <div className="flex-1 flex flex-col justify-between px-10 py-8 text-black">
//           {/* Top Copilot UI */}
//           <div className="flex flex-col items-center text-center">
//             <div className="text-6xl mb-4">🤖</div>
//             <h2 className="text-3xl font-semibold mb-2">Ask LogGuardian</h2>
//             <p className="text-sm text-gray-800 max-w-md mb-4">
//             LogGuardian is powered by AI, so mistakes are possible. Review output carefully before use.
//             </p>
//             <ul className="text-sm text-gray-400 space-y-1">
//               <li>📎 or type <code className="text-yellow-300 font-mono">#</code> to attach context</li>
//               <li>📡 <code className="text-yellow-300 font-mono">@</code> to chat with extensions</li>
//               <li>⌨️ Type <code className="text-yellow-300 font-mono">/</code> to use commands</li>
//             </ul>
//           </div>

//           {/* Message Box + Add Context */}
//           <div className="mt-8" style={{ "background-color": "white", "position": "fixed", "left": "20px", "right": "20px", "bottom": "20px", "border-radius": "15px", "padding": "15px 15px", "box-shadow": "7px 7px 15px lightgrey", "border": "1px solid lightgrey" }}>
//             <div className="flex items-center justify-between mb-2">
//               <select className="appearance-none bg-white border border-gray-300 px-4 py-2 rounded-md bg-lightgrey text-grey text-xs px-4 py-3 rounded-md border  border-gray-700" style={{ "background-color": "white", "border": "1px solid lightgrey" }}>
//                   <option>📎 Add Context... </option>
//                   {projects.map((project) => (
//                      <option key={project.id}>{project.name}</option>
//                   ))}
//               </select>
//             </div>

//             <div className="relative">
//               <input
//                 type="text" 
//                 placeholder="Ask LogGuardian"
//                 className="w-full text-sm text-grey border border-gray-700 rounded-md px-4 py-2 focus:outline-none placeholder:text-gray-400"
//                 style={{ "padding": "10px 8px", "border": "1px solid lightgrey" }}
//               />
//               <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg" style={{ "background": "none", "font-size": "20px", "border": "none" }}>
//                 <SendHorizontal />
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;








import React, { useState, useRef, useEffect } from "react";
import { SendHorizontal } from 'lucide-react';

const Chatbot = ({ projects }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedContext, setSelectedContext] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage = {
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      setTimeout(() => {
        const botMessage = {
          text: "I'm analyzing your logs and can help you with that. Based on the available data, I can see patterns in your system's behavior. Would you like me to provide more specific insights about particular aspects of your logs?",
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-gray-50 rounded-xl shadow-lg overflow-hidden mt-40">
      {/* Messages Container */}
      <div className="flex-1 p-6 overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center text-center h-full justify-center">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-3xl font-semibold mb-2">Ask LogGuardian</h2>
            <p className="text-sm text-gray-800 max-w-md mb-4">
              LogGuardian is powered by AI, so mistakes are possible. Review output carefully before use.
            </p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>📎 or type <code className="text-yellow-300 font-mono">#</code> to attach context</li>
              <li>📡 <code className="text-yellow-300 font-mono">@</code> to chat with extensions</li>
              <li>⌨️ Type <code className="text-yellow-300 font-mono">/</code> to use commands</li>
            </ul>
          </div>
        ) : (
          <div 
            className="h-full overflow-y-auto pr-4 space-y-4 messages-container"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <select
            className="appearance-none bg-white border border-gray-200 px-4 py-2 rounded-md text-gray-600 text-xs hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
            value={selectedContext}
            onChange={(e) => setSelectedContext(e.target.value)}
          >
            <option value="">📎 Add Context...</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask LogGuardian"
            className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleSendMessage}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .messages-container::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 3px;
        }
        
        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;