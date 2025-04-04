import React, { useEffect, useState } from 'react';
import Header from './components/Layout/Header';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import SendIcon from '@mui/icons-material/Send';
import imageCompression from 'browser-image-compression';
import { Snackbar, Alert, TextField } from '@mui/material';


const Home = () => {
  const [activeTab, setActiveTab] = useState('wikipedia');
  const [wikipediaInput, setWikipediaInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFormat, setActiveFormat] = useState('p5js');
  const [simulationActive, setSimulationActive] = useState(false);
  const [codeOutput, setCodeOutput] = useState('');
  const [summary, setSummary] = useState('');
  const [textInput, setTextInput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');

  const [showImageUpload, setShowImageUpload] = useState(false);
   const [imagePreview, setImagePreview] = useState('');
   const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [concept, setConcept] = useState({ name: '', principles: [] });
const [interactivityNotes, setInteractivityNotes] = useState('');
const [learningObjectives, setLearningObjectives] = useState([]);
  const [error, setError] = useState(null);
  const [showProFeatures, setShowProFeatures] = useState(false);
  const [apiKey, setApiKey] = useState('');


  
 
   const fetchImageData = async () => {
     setSimulationActive(false)
     
     // Validate we have an image file
     if (!imagePreview) {
       alert('Please select an image first');
       showSnackbar('Please select an image first', 'error');
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
               showSnackbar('Image analysis completed successfully!', 'success');  
             } else {
               console.error('No code found in response:', data);
               alert('No code was generated. Please try a different image.');
             }
           } else {
             alert(`Error: ${data.message || 'Failed to process image'}`);
             console.error('API Error:', data.message);
             showSnackbar(data.message || 'Failed to process image', 'error');
           }
         } catch (parseError) {
           console.error('Error parsing JSON from backend:', parseError);
           alert('Error processing the API response. Please try again.');
         }
       } else {
         console.error('API returned error status:', response.status);
         alert(`Server error: ${response.statusText}`);
         showSnackbar(`Server error: ${response.statusText}`, 'error');
       }
     } catch (error) {
       alert('Failed to process image. Please check your connection.');
       console.error('Error calling API:', error);
       showSnackbar('Failed to process image. Please check your connection.', 'error');
     }
     
     setIsProcessing(false);
   };
   
   const fetchWikiData = async () => {
    setSimulationActive(false)
    if (!wikipediaInput) return;

    setIsProcessing(true);
    setSummary("");
    setError(null);

    try {
      const response = await fetch("/api/wiki", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "wikipedia",
          input: wikipediaInput,
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
   
   const handleFileChange = async (e) => {
     const file = e.target.files[0];
   
     if (file) {
       // Validate file type
       const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
       if (!validImageTypes.includes(file.type)) {
        showSnackbar('Please select a valid image file (JPEG, PNG, JPG, or WEBP)', 'error');
         return;
       }
   
       // Validate file size (max 10MB)
       if (file.size > 10 * 1024 * 1024) {
        showSnackbar('Image size exceeds 10MB limit. Please select a smaller image.', 'error');
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
           showSnackbar('Image uploaded successfully!', 'success');
         };
         reader.readAsDataURL(compressedFile);
   
       } catch (error) {
         console.error('Image compression failed:', error);
         showSnackbar('Error compressing image. Please try again.', 'error');
       }
     }
   };
 

   useEffect(() => {
    if (activeTab === 'wikipedia' && wikipediaInput) {
      fetchWikiData();
    }
  }, [wikipediaInput, activeTab]);
 
   
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
   
   const handleFormatChange = (id) => {
    setActiveFormat(id);
  };
  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    const verification = verifyApiKeyStorage();
    if (!verification.allMatch) {
      console.warn('Storage verification failed:', verification);
      saveApiKey(apiKey);
    }
    showSnackbar('API Key saved successfully!');
  };
 
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

   const verifyApiKeyStorage = () => {
    const localStorageKey = localStorage.getItem('apiKey');
    console.log('LocalStorage API Key:', localStorageKey);

    const cookies = document.cookie.split('; ');
    const apiKeyCookie = cookies.find(row => row.startsWith('apiKey='));
    const cookieValue = apiKeyCookie ? apiKeyCookie.split('=')[1] : null;
    console.log('Cookie API Key:', cookieValue);
    console.log('Current State API Key:', apiKey);
    return {
      localStorageMatch: localStorageKey === apiKey,
      cookieMatch: cookieValue === apiKey,
      allMatch: localStorageKey === apiKey && cookieValue === apiKey
    };
  };
  const saveApiKey = (key) => {
    if (key.trim()) {
      localStorage.setItem('apiKey', key);
      document.cookie = `apiKey=${key}; path=/`;
      setApiKeySaved(true);
    } else {
      localStorage.removeItem('apiKey');
      document.cookie = 'apiKey=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setApiKeySaved(false);
    }
  };
  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    setApiKeySaved(false);
  };
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };


  return (
    <div className='bg-white'>
    <main className="max-w-10xl mx-auto px-4 sm:px-6 py-2">
         <Header />
    <div className="mb-6 ">
    <div className="space-y-6 ">
    <div className="bg-white  p-6 shadow-md  ">{activeTab === 'wikipedia' && (
    <>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span>🔗</span> Wikipedia Link</h3>
      <form    className="flex flex-col md:flex-row gap-4  items-start w-full">
      {/* Input Group */}
    <div className="flex gap-2 w-full md:w-auto">
      <input type="text" value={wikipediaInput} onChange={(e) => setWikipediaInput(e.target.value)} placeholder="Enter Wikipedia URL" className="w-full border rounded-lg px-4 py-2 md:min-w-[400px] lg:min-w-[480px]"
            disabled={isProcessing}/>
          <button type="submit" className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700  shrink-0 ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
               disabled={isProcessing || !apiKey} >
            <span>🔍</span>
          </button>
    </div>

      <div className=" w-full md:w-auto flex gap-2   overflow-x-auto  pb-2 md:pb-0 lg:pl-16">
        <FormatButton  
            id="mermaidjs" 
            label="Mermaid" 
            icon="🔀" 
            isActive={activeFormat === 'mermaidjs'} 
          />
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
        </div>
      </form>
    </>
  )}
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-screen h-screen  ">
  {/* Left Column */}
  <div className="space-y-6 h-full">
    {/* Code Editor */}
    <div className="bg-white  p-6 shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>👨‍💻</span> Code Editor
        </h3>
      </div>
      <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm flex-1 flex overflow-auto ">
        {isProcessing ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4  bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        ) : (
          <pre>{codeOutput || "// No code generated yet"}</pre>
        )}
      </div>
    </div>
  </div>
  {/* Right Column */}
  <div className="space-y-6 h-full">
    {/* Simulation Viewer */}
    <div className="bg-white  p-6 shadow-md h-full flex flex-col ">
      <div className="mb-4 ">
        <h3 className="text-lg font-semibold flex items-center gap-2  ">
          <span>📊</span> Simulation Viewer
        </h3> 
      </div>
      <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm flex-1 flex overflow-auto">
        {simulationActive ? (
          <div className="w-full h-full bg-black text-white">
             {activeFormat=== "p5js" && <P5jS running={true} result={codeOutput}/>}
            {activeFormat=== "threejs" && <ThreejS running={true} result={codeOutput}/>}
            {activeFormat=== "d3js" && <D3Editor running={true} result={codeOutput}/>}
            {activeFormat=== "mermaidjs" && <MermaidEditor running={true} result={codeOutput}/>} 
          </div>
        ) :null}
      </div>
    </div>
  </div>
</div>

<div className="bg-white pt-3 shadow-md flex flex-col md:flex-row gap-4 p-4">
<div className="w-full md:w-1/2 flex flex-col sm:flex-row gap-4 items-center">
<form onSubmit={handleApiKeySubmit} className="relative w-full sm:flex-1">
              <input 
                type="password" 
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="Type in your API Key" 
                className="w-full sm:flex-1 px-4 py-3 bg-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                disabled={!apiKey}
              >
                {apiKeySaved ? '✓' : <SendIcon />}
              </button>
            </form>

 <select onChange={(e) => setTextInput(e.target.value)} className="w-full sm:w-60 px-4 py-3 border-2 border-black rounded-lg bg-white focus:ring-2 focus:ring-blue-500" value={textInput}
 disabled={isProcessing} >
       <option value="Claude-instant">Claude</option>
</select>
</div>
<div className="w-full md:w-1/2 flex flex-col sm:flex-row gap-4 items-center">
<select onChange={(e) => setTextInput(e.target.value)} className="w-full sm:w-48 px-4 py-3 border-2 border-black rounded-lg bg-white focus:ring-2 focus:ring-blue-500" value={textInput}
 disabled={isProcessing}  >
                      <option value="">-- Select a template --</option>
                      <option value="Conway's Game of Life">Conway's Game of Life</option>
                      <option value="2D flocking animation">2D Flocking Animation</option>
                      <option value="3D forms panning">3D Forms Panning</option>
                      <option value="Wave propagation">Wave Propagation</option>
                    </select>
    <div className='flex-1'></div>
    <div className="flex gap-4 ml-auto">
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
</div>
{/* Prompt Input Container */}
<div className="bg-white shadow-md rounded-lg overflow-hidden">
  <div className="p-4">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        fetchData();
      }}
      className="space-y-4"
    >
      {/* Text Input Area */}
      <div className="relative">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Describe what you want to visualize..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isProcessing}
          aria-label="Description input for visualization"
        />
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
          {/* Left Action Buttons */}
          <div className="flex gap-2">
            {/* Image Upload Button */}
            <button
              type="button"
              onClick={() => setShowImageUpload(true)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="Upload image"
              disabled={isProcessing}
            >
              <ControlPointIcon sx={{ fontSize: 28 }} />
            </button>
            {showImageUpload && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>🖼️</span> Image Upload
        </h3>
        <button 
          onClick={() => setShowImageUpload(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        fetchImageData();
        setShowImageUpload(false);
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
    </div>
  </div>
)}
            
            {/* Camera Button (if needed) */}
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="Open camera"
              disabled={isProcessing}
            >
              <CameraAltOutlinedIcon sx={{ fontSize: 28 }} />
            </button>
          </div>
          <button type="button"
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="Add icon"
              disabled={isProcessing}>
           <ArrowCircleUpIcon sx={{ fontSize: 28 }}   />
          </button>
          
         
        </div>
      </div>
      
      {/* Main Submit Button (hidden on mobile) */}
      
    </form>
  </div>
</div>


  

 {/* Summary */}
 <div className="bg-white  p-3 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start  sm:items-center gap-2">
                <h3 className="text-lg font-semibold flex items-center gap-2 w-full sm:w-auto">
                  <span>📋</span> Summary
                </h3>
                <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                <span className="text-sm">Console log</span>
                <button 
        onClick={() => setShowProFeatures(!showProFeatures)}
        className="flex items-center gap-1"
      >
        <ExpandCircleDownOutlinedIcon 
          sx={{ 
            fontSize: 20,
            transform: showProFeatures ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }} 
          aria-label="Toggle pro features" 
        />
      </button>
              </div>   
 </div>
<div className="bg-gray-50 p-4 rounded-lg">
  {isProcessing ? (
    <div className="animate-pulse space-y-2">
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                ) : (
                  <>
                  <p className="text-gray-700">{summary || "Summary will appear here"}</p>
                  {showProFeatures && (
                    <div className="mt-3 flex justify-end">
            <button
              className="px-3 py-1 rounded-lg text-sm bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              disabled={!summary}
              onClick={() => {
                // Add your MCQ generation logic here
                console.log("Generating MCQs based on:", summary);
              }}
            >
              Generate MCQ
            </button>
          </div>
                  )}
                  </>
                )}
              </div>
            </div>

            
            <Snackbar
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
>
  <Alert 
    onClose={() => setSnackbarOpen(false)} 
    severity={snackbarSeverity}
    sx={{ width: '100%' }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>
   </main>  
   </div>   
  );
};

export default Home;
