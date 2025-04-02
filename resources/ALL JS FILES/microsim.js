import React, { useState } from 'react';

const MicroSimApp = () => {
  // State for input and viewing
  const [activeTab, setActiveTab] = useState('wikipedia');
  const [wikipediaInput, setWikipediaInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  
  // Content state
  const [summary, setSummary] = useState('');
  const [activeFormat, setActiveFormat] = useState('p5js');
  const [consoleOutput, setConsoleOutput] = useState('');
  
  // Example code snippets for demo purposes
  const codeExamples = {
    p5js: `function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 100);
}

function draw() {
  background(20);
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      let x = i * 20;
      let y = j * 20;
      let hue = (frameCount + i + j) % 100;
      fill(hue, 80, 90);
      rect(x, y, 18, 18);
    }
  }
}`,
    mermaidjs: `graph TD
  A[Start] --> B{Is it raining?}
  B -->|Yes| C[Take umbrella]
  B -->|No| D[Don't take umbrella]
  C --> E[Go outside]
  D --> E`,
    d3js: `const width = 400;
const height = 400;
const radius = Math.min(width, height) / 2;

const svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", \`translate(\${width/2},\${height/2})\`);

const data = [
  {name: "A", value: 20},
  {name: "B", value: 30},
  {name: "C", value: 15},
  {name: "D", value: 25},
  {name: "E", value: 10}
];

const color = d3.scaleOrdinal()
  .domain(data.map(d => d.name))
  .range(d3.schemeCategory10);

const pie = d3.pie()
  .value(d => d.value);

const arc = d3.arc()
  .innerRadius(0)
  .outerRadius(radius);

svg.selectAll("path")
  .data(pie(data))
  .enter()
  .append("path")
  .attr("d", arc)
  .attr("fill", d => color(d.data.name));`,
    threejs: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();`
  };

  // File upload handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission handlers
  const handleWikipediaSubmit = (e) => {
    e.preventDefault();
    if (!wikipediaInput) return;
    
    setIsProcessing(true);
    setSummary('');
    
    // Simulate API call
    setTimeout(() => {
      setSummary(`This is a summary of the Wikipedia article about "${wikipediaInput.split('/').pop().replace(/_/g, ' ')}". The visualization shows key concepts from this article.`);
      setSimulationActive(true);
      setIsProcessing(false);
    }, 1500);
  };
  
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput) return;
    
    setIsProcessing(true);
    setSummary('');
    
    // Simulate API call
    setTimeout(() => {
      setSummary(`This visualization represents the concept of "${textInput}" showing how the key elements interact with each other.`);
      setSimulationActive(true);
      setIsProcessing(false);
    }, 1500);
  };
  
  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (!imagePreview) return;
    
    setIsProcessing(true);
    setSummary('');
    
    // Simulate API call
    setTimeout(() => {
      setSummary('The uploaded image has been analyzed. This visualization represents the key concepts detected in the image.');
      setSimulationActive(true);
      setIsProcessing(false);
    }, 1500);
  };

  // Add text to console output
  const addConsoleOutput = (message, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    const formattedMessage = `[${timestamp}] ${isError ? '🔴 ' : ''}${message}`;
    setConsoleOutput(prev => `${prev ? prev + '\n' : ''}${formattedMessage}`);
  };

  // Handle format selection
  const handleFormatChange = (format) => {
    setActiveFormat(format);
    addConsoleOutput(`Switched to ${format} mode`);
  };

  // UI Components
  const TabButton = ({ id, label, icon, isActive }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );

  const FormatButton = ({ id, label, icon, isActive }) => (
    <button
      onClick={() => handleFormatChange(id)}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <span className="text-xl">💻</span>
            </div>
            <h1 className="text-xl font-bold">MicroSim Learning</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm">
              Help
            </button>
            <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm">
              Sign In
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex gap-2 overflow-x-auto">
              <TabButton 
                id="wikipedia" 
                label="Wikipedia" 
                icon="📚" 
                isActive={activeTab === 'wikipedia'} 
              />
              <TabButton 
                id="text" 
                label="Text Prompt" 
                icon="📝" 
                isActive={activeTab === 'text'} 
              />
              <TabButton 
                id="image" 
                label="Image Upload" 
                icon="🖼️" 
                isActive={activeTab === 'image'} 
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Input Panel */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              {activeTab === 'wikipedia' && (
                <>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>🔗</span> Wikipedia Link
                  </h3>
                  <form onSubmit={handleWikipediaSubmit} className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={wikipediaInput}
                        onChange={(e) => setWikipediaInput(e.target.value)}
                        placeholder="Enter Wikipedia URL"
                        className="flex-1 border rounded-lg px-4 py-2"
                        disabled={isProcessing}
                      />
                      <button
                        type="submit"
                        className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${
                          isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isProcessing}
                      >
                        <span>🔍</span>
                      </button>
                    </div>
                  </form>
                </>
              )}
              
              {activeTab === 'text' && (
                <>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>📄</span> Text Prompt
                  </h3>
                  <form onSubmit={handleTextSubmit} className="space-y-4">
                    <select
                      onChange={(e) => setTextInput(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2 mb-4"
                      value={textInput}
                      disabled={isProcessing}
                    >
                      <option value="">-- Select a template or enter your own --</option>
                      <option value="Conway's Game of Life">Conway's Game of Life</option>
                      <option value="2D flocking animation">2D Flocking Animation</option>
                      <option value="3D forms panning">3D Forms Panning</option>
                      <option value="Wave propagation">Wave Propagation</option>
                    </select>
                    
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Describe what you want to visualize"
                      rows={4}
                      className="w-full border rounded-lg px-4 py-2"
                      disabled={isProcessing}
                    />
                    
                    <button
                      type="submit"
                      className={`w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${
                        isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Generating...' : 'Generate Microsim'}
                    </button>
                  </form>
                </>
              )}
              
              {activeTab === 'image' && (
                <>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>🖼️</span> Image Upload
                  </h3>
                  <form onSubmit={handleImageSubmit} className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded"
                          />
                          <button
                            type="button"
                            onClick={() => setImagePreview('')}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <span className="text-4xl">📤</span>
                          <p className="text-gray-500">
                            Drag and drop an image here, or click to select
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            disabled={isProcessing}
                          />
                          <label
                            htmlFor="file-upload"
                            className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300"
                          >
                            Select File
                          </label>
                        </div>
                      )}
                    </div>
                    
                    {imagePreview && (
                      <button
                        type="submit"
                        className={`w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${
                          isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Analyzing...' : 'Analyze Image'}
                      </button>
                    )}
                  </form>
                </>
              )}
            </div>
            
            {/* Code Editor */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>👨‍💻</span> Code Editor
                </h3>
                
                <div className="flex items-center gap-2">
                  <button 
                    className={`p-2 rounded-lg ${simulationActive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                    onClick={() => setSimulationActive(!simulationActive)}
                  >
                    {simulationActive ? '⏹️' : '▶️'}
                  </button>
                  <button className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    💾
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm h-64 overflow-auto">
                {isProcessing ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  </div>
                ) : (
                  <pre>{codeExamples[activeFormat] || "// No code generated yet"}</pre>
                )}
              </div>
            </div>
            
            {/* Summary */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>📋</span> Summary
                </h3>
                <button
                  className="px-3 py-1 rounded-lg text-sm bg-purple-100 text-purple-600 hover:bg-purple-200"
                  disabled={!summary}
                >
                  Generate MCQ
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                {isProcessing ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                ) : (
                  <p className="text-gray-700">{summary || "Summary will appear here"}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Simulation Viewer */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <span>📊</span> Simulation Viewer
                </h3>
                
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <FormatButton 
                    id="p5js" 
                    label="p5.js" 
                    icon="🎨" 
                    isActive={activeFormat === 'p5js'} 
                  />
                  <FormatButton 
                    id="threejs" 
                    label="Three.js" 
                    icon="🧊" 
                    isActive={activeFormat === 'threejs'} 
                  />
                  <FormatButton 
                    id="d3js" 
                    label="D3.js" 
                    icon="📊" 
                    isActive={activeFormat === 'd3js'} 
                  />
                  <FormatButton 
                    id="mermaidjs" 
                    label="Mermaid" 
                    icon="🔀" 
                    isActive={activeFormat === 'mermaidjs'} 
                  />
                </div>
              </div>
              
              <div className="relative bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
                {simulationActive ? (
                  <div className="w-full h-full bg-white">
                    <iframe
                      title="Simulation"
                      src="about:blank"
                      className="w-full h-full rounded-lg"
                      sandbox="allow-scripts"
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <span className="text-4xl">▶️</span>
                    <p className="mt-2">Generate content to see simulation</p>
                  </div>
                )}
              </div>
              
              {/* Console Output */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Console Output:</h4>
                <div className="bg-gray-800 text-gray-200 p-3 rounded-lg font-mono text-xs h-32 overflow-auto">
                  {consoleOutput || "// Console output will appear here"}
                </div>
              </div>
            </div>
            
            {/* MCQ Section (hidden initially) */}
            {/*
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>❓</span> Multiple Choice Questions
              </h3>
              
              <div className="space-y-6">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="font-medium mb-3">1. What is the main concept visualized in this simulation?</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="radio" id="q1-opt1" name="question-1" className="mr-2" />
                      <label htmlFor="q1-opt1">Particle dynamics</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="q1-opt2" name="question-1" className="mr-2" />
                      <label htmlFor="q1-opt2">Fluid mechanics</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="q1-opt3" name="question-1" className="mr-2" />
                      <label htmlFor="q1-opt3">Quantum field theory</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="q1-opt4" name="question-1" className="mr-2" />
                      <label htmlFor="q1-opt4">Statistical mechanics</label>
                    </div>
                  </div>
                  <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm">
                    Show Answer
                  </button>
                </div>
              </div>
            </div>
            */}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white shadow-md mt-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">© 2025 MicroSim Learning</p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MicroSimApp;