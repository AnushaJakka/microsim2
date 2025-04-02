import React, { useEffect, useRef, useState } from 'react';

const EnhancedSimulationRenderer = ({ 
  code, 
  format, 
  isRunning, 
  onConsoleOutput,
  interactivityNotes
}) => {
  const iframeRef = useRef(null);
  const [error, setError] = useState(null);
  const [showInteractivityHelp, setShowInteractivityHelp] = useState(false);
  
  // Effect to handle running/stopping the simulation
  useEffect(() => {
    if (!iframeRef.current || !code) return;
    
    if (isRunning) {
      renderSimulation();
    } else {
      stopSimulation();
    }
  }, [isRunning, code, format]);
  
  // Effect to set up message listener
  useEffect(() => {
    const handleMessage = (event) => {
      // Only accept messages from our iframe
      if (iframeRef.current && event.source === iframeRef.current.contentWindow) {
        if (event.data && (event.data.type === 'console' || event.data.type === 'error')) {
          if (onConsoleOutput) {
            onConsoleOutput(event.data.message, event.data.type === 'error');
          }
          
          if (event.data.type === 'error') {
            setError(event.data.message);
          }
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleOutput]);

  // Auto-show interactivity notes on first run
  useEffect(() => {
    if (isRunning && interactivityNotes) {
      setShowInteractivityHelp(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowInteractivityHelp(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isRunning, interactivityNotes]);
  
  // Function to stop the simulation
  const stopSimulation = () => {
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ action: 'stop' }, '*');
      }
    } catch (error) {
      console.error('Error stopping simulation:', error);
    }
  };
  
  // Function to render the simulation
  const renderSimulation = () => {
    setError(null);
    
    if (!iframeRef.current || !code) return;
    
    try {
      const iframe = iframeRef.current;
      
      // Create HTML content based on the format
      let htmlContent = '';
      
      switch (format) {
        case 'p5js':
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/addons/p5.sound.min.js"></script>
              <style>
                body { margin: 0; overflow: hidden; background-color: #f9f9f9; }
                canvas { display: block; }
              </style>
            </head>
            <body>
              <script>
                // Set up console.log capture
                (function() {
                  const originalConsoleLog = console.log;
                  console.log = function(...args) {
                    originalConsoleLog.apply(console, args);
                    window.parent.postMessage({
                      type: 'console',
                      message: args.map(arg => String(arg)).join(' ')
                    }, '*');
                  };
                  
                  console.error = function(...args) {
                    originalConsoleLog.apply(console, args);
                    window.parent.postMessage({
                      type: 'error',
                      message: args.map(arg => String(arg)).join(' ')
                    }, '*');
                  };
                  
                  window.onerror = function(message, source, lineno, colno, error) {
                    window.parent.postMessage({
                      type: 'error',
                      message: message
                    }, '*');
                    return true;
                  };
                })();
                
                // Add handler for stop messages
                window.addEventListener('message', function(event) {
                  if (event.data && event.data.action === 'stop') {
                    if (typeof noLoop === 'function') {
                      noLoop();
                    }
                    // Additional cleanup if needed
                  }
                });
                
                ${code}
              </script>
            </body>
            </html>
          `;
          break;
          
        case 'threejs':
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
              <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js"></script>
              <style>
                body { margin: 0; overflow: hidden; background-color: #f9f9f9; }
                canvas { display: block; }
              </style>
            </head>
            <body>
              <script>
                // Set up console.log capture
                (function() {
                  const originalConsoleLog = console.log;
                  console.log = function(...args) {
                    originalConsoleLog.apply(console, args);
                    window.parent.postMessage({
                      type: 'console',
                      message: args.map(arg => String(arg)).join(' ')
                    }, '*');
                  };
                  
                  console.error = function(...args) {
                    originalConsoleLog.apply(console, args);
                    window.parent.postMessage({
                      type: 'error',
                      message: args.map(arg => String(arg)).join(' ')
                    }, '*');
                  };
                  
                  window.onerror = function(message, source, lineno, colno, error) {
                    window.parent.postMessage({
                      type: 'error',
                      message: message
                    }, '*');
                    return true;
                  };
                })();
                
                // Add handler for stop messages
                window.addEventListener('message', function(event) {
                  if (event.data && event.data.action === 'stop') {
                    // Stop animation frame if it exists
                    if (window.animationFrameId) {
                      cancelAnimationFrame(window.animationFrameId);
                    }
                  }
                });
                
                ${code}
              </script>
            </body>
            </html>
          `;
          break;
          
        case 'd3js':
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.2/d3.min.js"></script>
              <style>
                body { margin: 0; overflow: hidden; font-family: Arial, sans-serif; background-color: #f9f9f9; }
                svg { display: block; margin: 0 auto; }
                .tooltip { position: absolute; padding: 8px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; pointer-events: none; }
              </style>
            </head>
            <body>
              <script>
                // Set up console.log capture
                (function() {
                  const originalConsoleLog = console.log;
                  console.log = function(...args) {
                    originalConsoleLog.apply(console, args);
                    window.parent.postMessage({
                      type: 'console',
                      message: args.map(arg => String(arg)).join(' ')
                    }, '*');
                  };
                  
                  console.error = function(...args) {
                    originalConsoleLog.apply(console, args);
                    window.parent.postMessage({
                      type: 'error',
                      message: args.map(arg => String(arg)).join(' ')
                    }, '*');
                  };
                  
                  window.onerror = function(message, source, lineno, colno, error) {
                    window.parent.postMessage({
                      type: 'error',
                      message: message
                    }, '*');
                    return true;
                  };
                })();
                
                ${code}
              </script>
            </body>
            </html>
          `;
          break;
          
        case 'mermaidjs':
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.0.2/mermaid.min.js"></script>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f9f9f9; }
                #diagram { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
                svg { max-width: 100%; max-height: 100%; }
              </style>
            </head>
            <body>
              <div id="diagram"></div>
              <script>
                // Set up console.log capture
                (function() {
                  const originalConsoleLog = console.log;
                  console.log = function(...args) {
                    originalConsoleLog.apply(console, args);
                    window.parent.postMessage({
                      type: 'console',
                      message: args.map(arg => String(arg)).join(' ')
                    }, '*');
                  };
                  
                  console.error = function(...args) {
                    originalConsoleLog.apply(console, args);
                    window.parent.postMessage({
                      type: 'error',
                      message: args.map(arg => String(arg)).join(' ')
                    }, '*');
                  };
                  
                  window.onerror = function(message, source, lineno, colno, error) {
                    window.parent.postMessage({
                      type: 'error',
                      message: message
                    }, '*');
                    return true;
                  };
                })();
                
                mermaid.initialize({
                  startOnLoad: true,
                  theme: 'default',
                  securityLevel: 'loose',
                  flowchart: { useMaxWidth: false, htmlLabels: true }
                });
                
                document.addEventListener('DOMContentLoaded', function() {
                  const element = document.getElementById('diagram');
                   const graphDefinition = \`${code.replace(/`/g, "\\`")}\`;
                  //  const graphDefinition = ${code};
                  consile.log(graphDefinition)
                  try {
                    mermaid.render('mermaid-svg', graphDefinition).then(result => {
                      element.innerHTML = result.svg;
                      console.log('Mermaid diagram rendered successfully');
                    }).catch(error => {
                      console.error('Error rendering mermaid diagram:', error);
                      element.innerHTML = '<div style="color: red; padding: 20px;">Error rendering diagram</div>';
                      window.parent.postMessage({
                        type: 'error',
                        message: 'Error rendering mermaid diagram: ' + error.message
                      }, '*');
                    });
                  } catch (error) {
                    console.error('Exception rendering mermaid diagram:', error);
                    element.innerHTML = '<div style="color: red; padding: 20px;">Error rendering diagram</div>';
                    window.parent.postMessage({
                      type: 'error',
                      message: 'Exception rendering mermaid diagram: ' + error.message
                    }, '*');
                  }
                });
              </script>
            </body>
            </html>
          `;
          break;
          
        default:
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif; background-color: #f9f9f9; }
              </style>
            </head>
            <body>
              <div style="text-align: center; color: #666;">
                <p>Unsupported format: ${format}</p>
                <p>Please select a different format.</p>
              </div>
            </body>
            </html>
          `;
      }
      
      // Set the iframe content with sandbox restrictions
      iframe.srcdoc = htmlContent;
    } catch (error) {
      console.error('Error rendering simulation:', error);
      setError(`Error rendering simulation: ${error.message}`);
      
      if (onConsoleOutput) {
        onConsoleOutput(`Error rendering simulation: ${error.message}`, true);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg">
      {/* The iframe for rendering simulations */}
      <iframe
        ref={iframeRef}
        title="Simulation Viewer"
        className="w-full h-full border-0 rounded-lg"
        sandbox="allow-scripts"
      />
      
      {/* Interactivity help overlay */}
      {isRunning && interactivityNotes && (
        <div 
          className={`absolute top-2 right-2 max-w-xs bg-blue-100 bg-opacity-90 p-3 rounded-lg shadow-md transition-opacity duration-300 ${
            showInteractivityHelp ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex justify-between items-start">
            <h4 className="text-blue-800 font-medium text-sm mb-1">How to interact:</h4>
            <button 
              className="text-blue-500 hover:text-blue-700" 
              onClick={() => setShowInteractivityHelp(false)}
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-blue-700">{interactivityNotes}</p>
        </div>
      )}
      
      {/* Help button - always visible when not showing help */}
      {isRunning && interactivityNotes && !showInteractivityHelp && (
        <button
          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md hover:bg-blue-600"
          onClick={() => setShowInteractivityHelp(true)}
          title="Interaction help"
        >
          ?
        </button>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 bg-red-50 bg-opacity-90 flex items-center justify-center p-4 rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
            <h3 className="text-red-600 font-bold mb-2">Error</h3>
            <p className="text-gray-800">{error}</p>
            <button 
              className="mt-3 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      
      {/* Overlay for when code is not running */}
      {!isRunning && !error && (
        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center rounded-lg">
          <div className="text-center p-4">
            <div className="bg-blue-600 text-white rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <span className="text-2xl">▶️</span>
            </div>
            <p className="text-gray-800 font-medium">
              {code ? "Click Play to run simulation" : "Generate content to see simulation"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSimulationRenderer;
