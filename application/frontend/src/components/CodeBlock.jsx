import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ children, language = 'text' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed border border-gray-700">
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;



