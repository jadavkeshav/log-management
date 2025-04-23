// import React, { useState } from 'react';
// import { Send, ChevronDown, X, MessageSquare } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// function Chatbot({ projects, isEmbedded = false }) {
//   const [isOpen, setIsOpen] = useState(isEmbedded);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [selectedContext, setSelectedContext] = useState([]);
//   const [showContextMenu, setShowContextMenu] = useState(false);

//   const handleSend = () => {
//     if (input.trim()) {
//       setMessages([...messages, { text: input, sender: 'user' }]);
//       setInput('');
//       // Simulate AI response
//       setTimeout(() => {
//         setMessages(prev => [...prev, {
//           text: "I'm an AI assistant. I'm here to help you with your projects.",
//           sender: 'ai'
//         }]);
//       }, 1000);
//     }
//   };

//   const toggleContext = (projectId) => {
//     setSelectedContext(prev => 
//       prev.includes(projectId)
//         ? prev.filter(id => id !== projectId)
//         : [...prev, projectId]
//     );
//   };

//   const ChatWindow = () => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 20 }}
//       className={`bg-white rounded-lg shadow-xl ${isEmbedded ? 'w-full max-w-4xl' : 'w-96 mb-4'}`}
//     >
//       <div className="border-b p-4 flex justify-between items-center">
//         <h3 className="font-semibold">AI Assistant</h3>
//         <button
//           onClick={() => setShowContextMenu(!showContextMenu)}
//           className="text-gray-600 hover:text-gray-800"
//         >
//           <ChevronDown className="h-5 w-5" />
//         </button>
//       </div>

//       {showContextMenu && (
//         <div className="border-b p-4">
//           <h4 className="font-medium mb-2">Add context from:</h4>
//           <div className="space-y-2">
//             {projects.map(project => (
//               <label
//                 key={project.id}
//                 className="flex items-center space-x-2 cursor-pointer"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedContext.includes(project.id)}
//                   onChange={() => toggleContext(project.id)}
//                   className="rounded text-blue-600"
//                 />
//                 <span>{project.name}</span>
//               </label>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className={`${isEmbedded ? 'h-[60vh]' : 'h-96'} overflow-y-auto p-4 space-y-4`}>
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               message.sender === 'user' ? 'justify-end' : 'justify-start'
//             }`}
//           >
//             <div
//               className={`rounded-lg px-4 py-2 max-w-[80%] ${
//                 message.sender === 'user'
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-100'
//               }`}
//             >
//               {message.text}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="border-t p-4">
//         <div className="flex items-center space-x-2">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//             placeholder="Ask anything..."
//             className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={handleSend}
//             className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//           >
//             <Send className="h-5 w-5" />
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );

//   if (isEmbedded) {
//     return <ChatWindow />;
//   }

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       <AnimatePresence>
//         {isOpen && <ChatWindow />}
//       </AnimatePresence>

//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
//       >
//         {isOpen ? (
//           <X className="h-6 w-6" />
//         ) : (
//           <MessageSquare className="h-6 w-6" />
//         )}
//       </button>
//     </div>
//   );
// }

// export default Chatbot;











import React from "react";
import { SendHorizontal } from 'lucide-react';
const Chatbot = ({ projects }) => {
  return (
    <div className="min-w-screen overflow-hidden flex text-white">
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}

        {/* Copilot Panel */}
        <div className="flex-1 flex flex-col justify-between px-10 py-8 text-black">
          {/* Top Copilot UI */}
          <div className="flex flex-col items-center text-center">
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

          {/* Message Box + Add Context */}
          <div className="mt-8" style={{ "background-color": "white", "position": "fixed", "left": "20px", "right": "20px", "bottom": "20px", "border-radius": "15px", "padding": "15px 15px", "box-shadow": "7px 7px 15px lightgrey", "border": "1px solid lightgrey" }}>
            <div className="flex items-center justify-between mb-2">
              <select className="appearance-none bg-white border border-gray-300 px-4 py-2 rounded-md bg-lightgrey text-grey text-xs px-4 py-3 rounded-md border  border-gray-700" style={{ "background-color": "white", "border": "1px solid lightgrey" }}>
                  <option>📎 Add Context... </option>
                  {projects.map((project) => (
                     <option key={project.id}>{project.name}</option>
                  ))}
              </select>
            </div>

            <div className="relative">
              <input
                type="text" 
                placeholder="Ask LogGuardian"
                className="w-full text-sm text-grey border border-gray-700 rounded-md px-4 py-2 focus:outline-none placeholder:text-gray-400"
                style={{ "padding": "10px 8px", "border": "1px solid lightgrey" }}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg" style={{ "background": "none", "font-size": "20px", "border": "none" }}>
                <SendHorizontal />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
