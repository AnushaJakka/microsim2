export default function ThreejS({ running, result }) {
    const generateSrcDoc = (script) => `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Three.js Simulation</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js"></script>
          <style>
            body { margin: 0; overflow: hidden; }
            canvas { display: block; }
          </style>
        </head>
        <body>
          <script>
            try {
              ${script}
            } catch (error) {
              console.error("Error in Three.js script:", error);
            }
          </script>
        </body>
      </html>`;
  
    if (!running) {
      return (
        <div className="w-full min-h-[500px] bg-gray-100 rounded text-sm text-gray-400 flex justify-center items-center">
          No sketches running
        </div>
      );
    }
  
    return (
      <div className="w-full min-h-[500px] border border-gray-300 rounded">
        <iframe 
          width="100%" 
          height="500" 
          srcDoc={generateSrcDoc(result)} 
          sandbox="allow-scripts"
        />
      </div>
    );
  }
  