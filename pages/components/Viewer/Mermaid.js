import { useEffect, useState } from "react";

export default function MermaidEditor({ running, result }) {
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    // Force iframe reload when result changes
    setIframeKey((prev) => prev + 1);
  }, [result]);

  const generateSrcDoc = (script) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mermaid Editor</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.9.0/mermaid.min.js"></script>
        <style>
          body { margin: 0; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; }
          #mermaid-container { width: 100%; max-width: 800px; display: flex; justify-content: center; align-items: center;}
        </style>
      </head>
      <body>
        <div id="mermaid-container">
          <pre class="mermaid">
            ${script}
          </pre>
        </div>
        <script>
          try {
            mermaid.initialize({ startOnLoad: true });
          } catch (error) {
            console.error("Mermaid rendering error:", error);
            document.body.innerHTML += '<p style="color:red;">Error in Mermaid script. Check console.</p>';
          }
        </script>
      </body>
    </html>`;

  if (!running) {
    return (
      <div className="w-full min-h-[500px] bg-gray-100 rounded text-sm text-gray-400 flex justify-center items-center">
        No diagrams running
      </div>
    );
  }

  return (
    <div className="w-full min-h-[500px]  border border-gray-300 rounded">
      <iframe 
        key={iframeKey}
        width="100%" 
        height="500" 
        srcDoc={generateSrcDoc(result)} 
        sandbox="allow-scripts"
      />
    </div>
  );
}
