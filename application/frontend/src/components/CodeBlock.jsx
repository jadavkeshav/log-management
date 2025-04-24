const CodeBlock = ({ children, language }) => {
    return (
      <div className="my-4">
        <pre className="bg-gray-800 text-gray-100 rounded-md p-4 overflow-x-auto">
          <code className={language ? `language-${language}` : ""}>{children}</code>
        </pre>
      </div>
    )
  }
  
  export default CodeBlock
  