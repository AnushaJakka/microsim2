import React, { useState, useEffect } from 'react';

const MicroSimApp = () => {
  // State for input and viewing
  const [activeTab, setActiveTab] = useState('wikipedia');
  const [wikipediaInput, setWikipediaInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  
  // Content state
  const [summary, setSummary] = useState('');
  const [codeOutputs, setCodeOutputs] = useState({});
  const [activeFormat, setActiveFormat] = useState('p5js');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [concept, setConcept] = useState(null);
  
  // MCQ state
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [showMCQ, setShowMCQ] = useState(false);
  const [generatingMCQ, setGeneratingMCQ] = useState(false);
  
  // Templates for the text input
  const templates = [
    { value: "Conway's Game of Life", label: "Conway's Game of Life" },
    { value: "2D flocking animation", label: "2D Flocking Animation" },
    { value: "3D forms panning", label: "3D Forms Panning" },
    { value: "Pendulum simulation", label: "Pendulum Physics" },
    { value: "Sound wave visualization", label: "Sound Wave Visualization" }
  ];

  // File upload handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setImagePreview(result);
        setImageBase64(result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop for images
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setImagePreview(result);
        setImageBase64(result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle console output from the simulation
  const handleConsoleOutput = (message, isError = false, clearConsole = false) => {
    if (clearConsole) {
      setConsoleOutput('');
    } else {
      const timestamp = new Date().toLocaleTimeString();
      const formattedMessage = `[${timestamp}] ${isError ? '🔴 ' : ''}${message}`;
      setConsoleOutput(prev => prev ? `${prev}\n${formattedMessage}` : formattedMessage);
    }
  };

  // API Calls
  const processWikipedia = async () => {
    if (!wikipediaInput) return;
    
    setIsProcessing(true);
    setConsoleOutput('');
    setSummary('Analyzing Wikipedia article...');
    setCodeOutputs({});
    setConcept(null);
    setShowMCQ(false);
    
    try {
      // In a real implementation, this would be an actual API call to your backend
      // where Claude API is integrated
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source: 'wikipedia',
          input: wikipediaInput,
          format: activeFormat
        })
      }).catch(err => {
        // Simulate API response for demo purposes
        console.log("Using simulated API response");
        return { 
          ok: true,
          json: () => Promise.resolve({
            success: true,
            summary: `This is a simulation based on the Wikipedia article about "${wikipediaInput.split('/').pop().replace(/_/g, ' ')}". The visualization demonstrates key principles found in the article, allowing interactive exploration of the concept.`,
            codeOutputs: {
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
    D --> E`
            },
            concept: {
              name: wikipediaInput.split('/').pop().replace(/_/g, ' '),
              principles: ["Key Principle 1", "Key Principle 2", "Key Principle 3"]
            }
          })
        };
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSummary(data.summary);
        setCodeOutputs(data.codeOutputs);
        setConcept(data.concept);
        handleConsoleOutput('Wikipedia analysis complete. Ready to run simulation.');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error processing Wikipedia:', error);
      setSummary(`Error: ${error.message}`);
      handleConsoleOutput(`Error: ${error.message}`, true);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const processTextPrompt = async () => {
    if (!textInput) return;
    
    setIsProcessing(true);
    setConsoleOutput('');
    setSummary('Generating from text prompt...');
    setCodeOutputs({});
    setConcept(null);
    setShowMCQ(false);
    
    try {
      // In a real implementation, this would be an actual API call to your backend
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source: 'text',
          input: textInput,
          format: activeFormat
        })
      }).catch(err => {
        // Simulate API response for demo purposes
        console.log("Using simulated API response");
        return { 
          ok: true,
          json: () => Promise.resolve({
            success: true,
            summary: `This simulation visualizes the concept of "${textInput}". The interactive elements demonstrate how the key principles work together to create the observed behavior.`,
            codeOutputs: {
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
    D --> E`
            },
            concept: {
              name: textInput,
              principles: ["Key Principle 1", "Key Principle 2", "Key Principle 3"]
            }
          })
        };
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSummary(data.summary);
        setCodeOutputs(data.codeOutputs);
        setConcept(data.concept);
        handleConsoleOutput('Text prompt processed. Ready to run simulation.');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error processing text prompt:', error);
      setSummary(`Error: ${error.message}`);
      handleConsoleOutput(`Error: ${error.message}`, true);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const processImage = async () => {
    if (!imageBase64) return;
    
    setIsProcessing(true);
    setConsoleOutput('');
    setSummary('Analyzing image...');
    setCodeOutputs({});
    setConcept(null);
    setShowMCQ(false);
    
    try {
      // In a real implementation, this would be an actual API call to your backend
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source: 'image',
          input: imageBase64,
          format: activeFormat
        })
      }).catch(err => {
        // Simulate API response for demo purposes
        console.log("Using simulated API response");
        return { 
          ok: true,
          json: () => Promise.resolve({
            success: true,
            summary: `This simulation is based on the analysis of the uploaded image. The visual elements represent the key concepts identified in the image, allowing for interactive exploration.`,
            codeOutputs: {
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
    D --> E`
            },
            concept: {
              name: "Concept from Image",
              principles: ["Key Principle 1", "Key Principle 2", "Key Principle 3"]
            }
          })
        };
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSummary(data.summary);
        setCodeOutputs(data.codeOutputs);
        setConcept(data.concept);
        handleConsoleOutput('Image analysis complete. Ready to run simulation.');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setSummary(`Error: ${error.message}`);
      handleConsoleOutput(`Error: ${error.message}`, true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate MCQs from summary
  const generateMCQs = async () => {
    if (!summary) return;
    
    setGeneratingMCQ(true);
    
    try {
      // In a real implementation, this would be an actual API call to your backend
      const response = await fetch('/api/generate-mcq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary,
          concept
        })
      }).catch(err => {
        // Simulate API response for demo purposes
        console.log("Using simulated API response");
        return { 
          ok: true,
          json: () => Promise.resolve({
            success: true,
            mcq: {
              questions: [
                {
                  question: "What is the main concept visualized in this simulation?",
                  options: [
                    "Particle dynamics",
                    "Fluid mechanics",
                    "Quantum field theory",
                    "Statistical mechanics"
                  ],
                  correctAnswer: 0,
                  explanation: "The simulation primarily demonstrates particle dynamics, showing how individual elements interact with each other in a system."
                },
                {
                  question: "Which principle is demonstrated in the simulation?",
                  options: [
                    "Conservation of energy",
                    "Newton's laws of motion", 
                    "Brownian motion",
                    "Heisenberg's uncertainty principle"
                  ],
                  correctAnswer: 2,
                  explanation: "Brownian motion is clearly visualized in the random movements of particles that collectively create patterns."
                }
              ]
            }
          })
        };
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMcqQuestions(data.mcq.questions);
        setShowMCQ(true);
        handleConsoleOutput('MCQ questions generated successfully.');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error generating MCQs:', error);
      handleConsoleOutput(`Error generating MCQs: ${error.message}`, true);
    } finally {
      setGeneratingMCQ(false);
    }
  };

  // Form submission handlers
  const handleWikipediaSubmit = (e) => {
    e.preventDefault();
    processWikipedia();
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    processTextPrompt();
  };

  const handleImageSubmit = (e) => {
    e.preventDefault();
    processImage();
  };

  // Navigation components will continue in Part 2...

  return (
    <>
      {/* Rendering components will be implemented in Part 2 */}
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-blue-600">MicroSim Application</h1>
        <p className="mt-4">This is Part 1 of the implementation - API integration.</p>
      </div>
    </>
  );
};

export default MicroSimApp;
// This continues from Part 1 - adding the UI components
// In a real implementation, you would import the components from Part 1

const MicroSimApp = () => {
  // All state variables and functions from Part 1 would be here
  // For demonstration, we'll define them again but would be imported in practice
  
  // State for input and viewing
  const [activeTab, setActiveTab] = useState('wikipedia');
  const [wikipediaInput, setWikipediaInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  
  // Content state
  const [summary, setSummary] = useState('');
  const [codeOutputs, setCodeOutputs] = useState({});
  const [activeFormat, setActiveFormat] = useState('p5js');
  const [consoleOutput, setConsoleOutput] = useState('');
  
  // MCQ state
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [showMCQ, setShowMCQ] = useState(false);
  const [generatingMCQ, setGeneratingMCQ] = useState(false);
  
  // Templates for the text input
  const templates = [
    { value: "Conway's Game of Life", label: "Conway's Game of Life" },
    { value: "2D flocking animation", label: "2D Flocking Animation" },
    { value: "3D forms panning", label: "3D Forms Panning" },
    { value: "Pendulum simulation", label: "Pendulum Physics" }
  ];

  // UI Helper Components
  
  // Tab Button Component
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

  // Format Button Component
  const FormatButton = ({ id, label, icon, isActive }) => (
    <button
      onClick={() => setActiveFormat(id)}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );

  // SimulationRenderer Component (simplified version)
  const SimulationRenderer = ({ code, format, isRunning }) => {
    return (
      <div className="relative w-full h-full bg-gray-100 rounded-lg">
        {isRunning && code ? (
          <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
            {format === 'mermaidjs' ? (
              <div className="p-4 text-center">
                <pre className="text-left text-xs">{code}</pre>
                <p className="mt-4 text-gray-500">(Mermaid diagram would render here)</p>
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="animate-pulse flex space-x-4 mb-4">
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-36 bg-blue-200 rounded"></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-8 bg-blue-200 rounded col-span-2"></div>
                        <div className="h-8 bg-blue-200 rounded col-span-1"></div>
                      </div>
                      <div className="h-8 bg-blue-200 rounded"></div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-500">(Simulation would run here with real API implementation)</p>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
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

  // MCQ Component (simplified version)
  const MCQComponent = ({ questions }) => {
    const [userAnswers, setUserAnswers] = useState({});
    const [showExplanations, setShowExplanations] = useState({});
    const [submitted, setSubmitted] = useState(false);
    
    // Handle answer selection
    const handleAnswerSelect = (questionIndex, answerIndex) => {
      if (submitted) return;
      
      setUserAnswers({
        ...userAnswers,
        [questionIndex]: answerIndex
      });
    };
    
    // Toggle explanation visibility
    const toggleExplanation = (questionIndex) => {
      setShowExplanations({
        ...showExplanations,
        [questionIndex]: !showExplanations[questionIndex]
      });
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Multiple Choice Questions</h3>
        
        {questions.map((question, qIndex) => (
          <div 
            key={qIndex} 
            className="border rounded-lg p-4 mb-4 bg-gray-50"
          >
            <p className="font-medium mb-3">{qIndex + 1}. {question.question}</p>
            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center">
                  <input
                    type="radio"
                    id={`q${qIndex}-opt${oIndex}`}
                    name={`question-${qIndex}`}
                    className="mr-2"
                    checked={userAnswers[qIndex] === oIndex}
                    onChange={() => handleAnswerSelect(qIndex, oIndex)}
                    disabled={submitted}
                  />
                  <label htmlFor={`q${qIndex}-opt${oIndex}`}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
            
            {submitted && (
              <button 
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => toggleExplanation(qIndex)}
              >
                {showExplanations[qIndex] ? 'Hide Explanation' : 'Show Explanation'}
              </button>
            )}
            
            {submitted && showExplanations[qIndex] && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                <p className="font-medium">Explanation:</p>
                <p>{question.explanation}</p>
              </div>
            )}
          </div>
        ))}
        
        <button
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(userAnswers).length !== questions.length}
        >
          Submit Answers
        </button>
      </div>
    );
  };

  // This is the main render method for Part 2
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
        {/* Tab Navigation */}
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
        
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input and Code */}
          <div className="space-y-6">
            {/* Input Panel */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              {activeTab === 'wikipedia' && (
                <>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>🔗</span> Wikipedia Link
                  </h3>
                  <form className="space-y-4">
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
                  <form className="space-y-4">
                    <select
                      onChange={(e) => setTextInput(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2 mb-4"
                      value={textInput}
                      disabled={isProcessing}
                    >
                      <option value="">-- Select a template or enter your own --</option>
                      {templates.map(template => (
                        <option key={template.value} value={template.value}>
                          {template.label}
                        </option>
                      ))}
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
                  <form className="space-y-4">
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
                        className={`w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${
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
                    className={`p-2 rounded-lg ${simulationRunning ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                    onClick={() => setSimulationRunning(!simulationRunning)}
                    disabled={!codeOutputs[activeFormat]}
                  >
                    {simulationRunning ? '⏹️' : '▶️'}
                  </button>
                  <button 
                    className="p-2 rounded-lg bg-blue-100 text-blue-600"
                    onClick={() => {
                      if (codeOutputs[activeFormat]) {
                        const blob = new Blob([codeOutputs[activeFormat]], { type: 'text/javascript' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `simulation.${activeFormat === 'mermaidjs' ? 'mmd' : 'js'}`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }
                    }}
                    disabled={!codeOutputs[activeFormat]}
                  >
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
                  <pre className="whitespace-pre-wrap">{codeOutputs[activeFormat] || "// No code generated yet"}</pre>
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
                  className={`px-3 py-1 rounded-lg text-sm bg-purple-100 text-purple-600 hover:bg-purple-200 ${
                    !summary || generatingMCQ ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!summary || generatingMCQ}
                  onClick={() => {}}
                >
                  {generatingMCQ ? 'Generating...' : 'Generate MCQ'}
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
          
          {/* Right Column - Simulation and MCQ */}
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
              
              <div className="aspect-square">
                <SimulationRenderer 
                  code={codeOutputs[activeFormat]} 
                  format={activeFormat}
                  isRunning={simulationRunning}
                />
              </div>
              
              {/* Console Output */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Console Output:</h4>
                  <button 
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={() => setConsoleOutput('')}
                  >
                    Clear
                  </button>
                </div>
                <div className="bg-gray-800 text-gray-200 p-3 rounded-lg font-mono text-xs h-32 overflow-auto">
                  {consoleOutput || "// Console output will appear here"}
                </div>
              </div>
            </div>
            
            {/* MCQ Section - Will show when MCQs are generated */}
            {showMCQ && mcqQuestions && mcqQuestions.length > 0 && (
              <MCQComponent questions={mcqQuestions} />
            )}
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
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MicroSimApp;