import P5jS from '@/pages/components/Viewer/p5';
import React ,{ useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThreejS from '../../Viewer/Threejs';
import D3Editor from '../../Viewer/D3Editor';
import MermaidEditor from '../../Viewer/Mermaid';
import imageCompression from 'browser-image-compression';


const MainContent = () => {
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
const [codeOutput, setCodeOutput] = useState('');
const [concept, setConcept] = useState({ name: '', principles: [] });
const [interactivityNotes, setInteractivityNotes] = useState('');
const [learningObjectives, setLearningObjectives] = useState([]);
const [error, setError] = useState(null);



  const fetchImageData = async () => {
    setSimulationActive(false)
    
    // Validate we have an image file
    if (!imagePreview) {
      alert('Please select an image first');
      return;
    }
    
    setIsProcessing(true);
    setCodeOutput('');
    
    try {
      console.log('Submitting image to Claude API');
      
      // Send the base64 image data directly to the API
      const response = await fetch('/api/upload_gpt4v/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: imagePreview,
          formate:activeFormat // Base64 string from handleFileChange
        }),
      });
      
      if (response.ok) {
        try {
          const data = await response.json();
          console.log('API response received:', data);
          
          
          if (data.success) {
            // The backend now parses the JSON and returns the code directly
            if (data.p5jsCode) {
              console.log('Successfully received p5.js code');
              setCodeOutput(data?.p5jsCode)
              setSummary(data?.summary)  
            } else {
              console.error('No code found in response:', data);
              alert('No code was generated. Please try a different image.');
            }
          } else {
            alert(`Error: ${data.message || 'Failed to process image'}`);
            console.error('API Error:', data.message);
          }
        } catch (parseError) {
          console.error('Error parsing JSON from backend:', parseError);
          alert('Error processing the API response. Please try again.');
        }
      } else {
        console.error('API returned error status:', response.status);
        alert(`Server error: ${response.statusText}`);
      }
    } catch (error) {
      alert('Failed to process image. Please check your connection.');
      console.error('Error calling API:', error);
    }
    
    setIsProcessing(false);
  };



  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
  
    if (file) {
      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, JPG, or WEBP)');
        return;
      }
  
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size exceeds 10MB limit. Please select a smaller image.');
        return;
      }
  
      // Compression options
      const options = {
        maxSizeMB: 1, // Compress to ~1MB
        maxWidthOrHeight: 1920, // Max width or height
        useWebWorker: true
      };
  
      try {
        // Compress image
        const compressedFile = await imageCompression(file, options);
  
        // Convert compressed file to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result); // Update image preview
        };
        reader.readAsDataURL(compressedFile);
  
      } catch (error) {
        console.error('Image compression failed:', error);
        alert('Error compressing image. Please try again.');
      }
    }
  };


  // Example code snippets for demo purposes
//   const codeExamples = {
//     p5js: `let cols, rows;
// let grid;
// let resolution = 10;

// function setup() {
//   createCanvas(800, 600);
//   cols = width / resolution;
//   rows = height / resolution;
//   grid = makeGrid(cols, rows);
// }

// function draw() {
//   background(0);
//   displayGrid(grid);
//   grid = nextGeneration(grid);
// }

// function makeGrid(cols, rows) {
//   let grid = new Array(cols).fill().map(() => new Array(rows).fill(0));
//   for (let i = 0; i < cols; i++) {
//     for (let j = 0; j < rows; j++) {
//       grid[i][j] = floor(random(2)); // Randomly initialize cells
//     }
//   }
//   return grid;
// }

// function displayGrid(grid) {
//   for (let i = 0; i < cols; i++) {
//     for (let j = 0; j < rows; j++) {
//       let x = i * resolution;
//       let y = j * resolution;
//       if (grid[i][j] == 1) {
//         fill(255);
//       } else {
//         fill(0);
//       }
//       stroke(50);
//       rect(x, y, resolution, resolution);
//     }
//   }
// }

// function nextGeneration(grid) {
//   let newGrid = makeGrid(cols, rows);
//   for (let i = 0; i < cols; i++) {
//     for (let j = 0; j < rows; j++) {
//       let state = grid[i][j];
//       let neighbors = countNeighbors(grid, i, j);
//       if (state == 0 && neighbors == 3) {
//         newGrid[i][j] = 1;
//       } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
//         newGrid[i][j] = 0;
//       } else {
//         newGrid[i][j] = state;
//       }
//     }
//   }
//   return newGrid;
// }

// function countNeighbors(grid, x, y) {
//   let sum = 0;
//   for (let i = -1; i <= 1; i++) {
//     for (let j = -1; j <= 1; j++) {
//       let col = (x + i + cols) % cols;
//       let row = (y + j + rows) % rows;
//       sum += grid[col][row];
//     }
//   }
//   sum -= grid[x][y];
//   return sum;
// }
// `,
//     mermaidjs: `graph TD
//   A[Start] --> B{Is it raining?}
//   B -->|Yes| C[Take umbrella]
//   B -->|No| D[Don't take umbrella]
//   C --> E[Go outside]
//   D --> E`,
//     d3js: `const width = 400;
// const height = 400;
// const radius = Math.min(width, height) / 2;

// const svg = d3.select("body").append("svg")
//   .attr("width", width)
//   .attr("height", height)
//   .append("g")
//   .attr("transform", \`translate(\${width/2},\${height/2})\`);

// const data = [
//   {name: "A", value: 20},
//   {name: "B", value: 30},
//   {name: "C", value: 15},
//   {name: "D", value: 25},
//   {name: "E", value: 10}
// ];

// const color = d3.scaleOrdinal()
//   .domain(data.map(d => d.name))
//   .range(d3.schemeCategory10);

// const pie = d3.pie()
//   .value(d => d.value);

// const arc = d3.arc()
//   .innerRadius(0)
//   .outerRadius(radius);

// svg.selectAll("path")
//   .data(pie(data))
//   .enter()
//   .append("path")
//   .attr("d", arc)
//   .attr("fill", d => color(d.data.name));`,
//     threejs: `const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// camera.position.z = 5;

// function animate() {
//   requestAnimationFrame(animate);
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
//   renderer.render(scene, camera);
// }

// animate();`
//   };



  
const handleWikipediaSubmit = async (e) => {
    e.preventDefault();
    if (!wikipediaInput) return;
  
    setIsProcessing(true);
    setSummary('');
  
    try {
      const response = await fetch('/api/saveWikipedia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wikipediaUrl: wikipediaInput }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSummary(`Wikipedia link saved successfully: ${wikipediaInput}`);
        toast.success('Wikipedia link saved to database! ✅');
      } else {
        setSummary(data.error || 'Failed to save the link.');
        toast.error(data.error || 'Failed to save the link. ❌');
      }
    } catch (error) {
      setSummary('Error saving the link.');
      toast.error('Error saving the link. ❌');
    } finally {
      setIsProcessing(false);
    }
  };

  
  const fetchData = async () => {
    setSimulationActive(false)
    if (!textInput) return;

    setIsProcessing(true);
    setSummary("");
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "text",
          input: textInput,
          format: activeFormat,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate visualization");
      }

      setSummary(data.summary);
      setCodeOutput(data.codeOutputs?.[activeFormat] || "");
      setConcept({
        name: data.concept?.name || "",
        principles: data.concept?.principles || [],
      });
      setInteractivityNotes(data.interactivityNotes || "");
      setLearningObjectives(data.learningObjectives || "");
    } catch (error) {
      console.error("Error submitting text:", error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  console.log(activeTab)

  // Call fetchData when `activeFormat` changes
  useEffect(() => {
    if(activeTab === "text"){
      if (activeFormat) {
        fetchData();
      }
    }
    else if(activeTab === "image"){
      if (activeFormat) {
        fetchImageData();
      }
    }
    
  }, [activeFormat]); // API call will re-run when `activeFormat` changes
  
  
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
                  <form
      onSubmit={(e) => {
        e.preventDefault();
        fetchData(); // Call the function when submitting the form
      }}
      className="space-y-4"
    >
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
                  <form onSubmit={(e) => {
        e.preventDefault();
        fetchImageData(); // Call the function when submitting the form
      }} className="space-y-4">
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
                  <pre>{codeOutput || "// No code generated yet"}</pre>
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
                {simulationActive? (
                  <div className="w-full h-full bg-white">
                    {activeFormat=== "p5js" && <P5jS running={true} result={codeOutput}/>}
                    {activeFormat=== "threejs" && <ThreejS running={true} result={codeOutput}/>}
                    {activeFormat=== "d3js" && <D3Editor running={true} result={codeOutput}/>}
                    {activeFormat=== "mermaidjs" && <MermaidEditor running={true} result={codeOutput}/>}
                    {/* <EnhancedSimulationRenderer  code={codeOutput}
  format ={activeFormat}
  isRunning ={true}
  onConsoleOutput={consoleOutput}
  interactivityNotes={interactivityNotes} /> */}
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
            
            
          </div>
        </div>
      </main>
  )
}

export default MainContent