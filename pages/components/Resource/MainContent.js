import React, { useEffect, useState } from 'react';
import Header from '../Layout/Header';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';


const MainContent = () => {
  const [activeTab, setActiveTab] = useState('wikipedia');
  const [wikipediaInput, setWikipediaInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFormat, setActiveFormat] = useState('p5js');
  const [simulationActive, setSimulationActive] = useState(false);
  const [codeOutput, setCodeOutput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [summary, setSummary] = useState('');
  
  

  const fetchWikiData = async () => {
    if (!wikipediaInput) return;
    setIsProcessing(true);
    try {
      console.log('Fetching Wikipedia data for:', wikipediaInput);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSummary(`Fetched summary for ${wikipediaInput}`);
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormatChange = (id) => {
    setActiveFormat(id);
  };

  const FormatButton = ({ id, label, icon, isActive }) => (
    <button
      onClick={() => handleFormatChange(id)}
      className={`flex items-center gap-2 pl-9 pr-3  py-2 lg:pl-6 lg:pr-8 lg:py-2.5 rounded-lg text-sm transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } whitespace-nowrap`}>
      <span >{icon}</span><span >{label}</span>
    </button>
  );

  useEffect(() => {
    if (activeTab === 'wikipedia' && wikipediaInput) {
      fetchWikiData();
    }
  }, [wikipediaInput]);


  return (
    <div className='bg-white'>
    <main className="max-w-10xl mx-auto px-4 sm:px-6 py-2">
         <Header />
    <div className="mb-6 ">
    <div className="space-y-6 ">
                    {/* Input Panel */}
    <div className="bg-white  p-6 shadow-md  ">{activeTab === 'wikipedia' && (
    <>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span>🔗</span> Wikipedia Link</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        fetchWikiData();
      }} className="flex flex-col md:flex-row gap-4  items-start w-full">
      {/* Input Group */}
    <div className="flex gap-2 w-full md:w-auto">
      <input type="text" value={wikipediaInput} onChange={(e) => setWikipediaInput(e.target.value)} placeholder="Enter Wikipedia URL" className="w-full border rounded-lg px-4 py-2 md:min-w-[400px] lg:min-w-[480px]"
            disabled={isProcessing}/>
          <button type="submit" className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700  shrink-0 ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isProcessing}>
            <span>🔍</span>
          </button>
    </div>

      {/* Format Buttons */}
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
            // isActive={activeFormat === 'threejs'} 
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
             {/* {activeFormat=== "p5js" && <P5jS running={true} result={codeOutput}/>}
            {activeFormat=== "threejs" && <ThreejS running={true} result={codeOutput}/>}
            {activeFormat=== "d3js" && <D3Editor running={true} result={codeOutput}/>}
            {activeFormat=== "mermaidjs" && <MermaidEditor running={true} result={codeOutput}/>}  */}
          </div>
        ) :null
        }
      </div>
    </div>
  </div>
</div>

<div className="bg-white pt-3 shadow-md flex flex-col md:flex-row gap-4 p-4">
<div className="w-full md:w-1/2 flex flex-col sm:flex-row gap-4 items-center">
<input 
type="text" placeholder="Type in your API Key"
className="w-full sm:flex-1 px-4 py-3 bg-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
/>
<select className="w-full sm:w-60 px-4 py-3 border-2 border-black rounded-lg bg-white focus:ring-2 focus:ring-blue-500">
    <option value="1" >Model</option>
    <option value="2">1</option>
    <option value="3">2</option>
    </select>
</div>
<div className="w-full md:w-1/2 flex flex-col sm:flex-row gap-4 items-center">
<select className="w-full sm:w-48 px-4 py-3 border-2 border-black rounded-lg bg-white focus:ring-2 focus:ring-blue-500">
      <option>Example</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
    </select>
    <div className='flex-1'></div>
    <div className="flex gap-4 ml-auto">
      <button 
                    className={`p-2 rounded-lg ${simulationActive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                    onClick={() => setSimulationActive(!simulationActive)}
                  >
                    {simulationActive ? '⏹️' : '▶️'}
                  </button>
                  <button className="p-2 rounded-lg bg-blue-100 text-blue-600 gap-2">
                    💾
                  </button>
   </div>
</div>
</div>
{/* Prompt Input Container */}
<div className="bg-white   shadow-md pt-3">
  <div className="space-y-4">
    <div className="relative   bg-gray-200 ">
      <div className="h-32 p-4 
                 outline-none overflow-y-auto font-mono text-sm
                 whitespace-pre-wrap"
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder="Prompt Input"
      >
        {/* Text content will go here */}
    </div>
    {/* Icons Section - Absolute positioned at bottom */}
      <div className=" absolute bottom-0 left-0 right-0  flex justify-between items-center px-4 pb-2 ">
        {/* Left Side Icons */}
        <div className="flex  gap-2  ">
          <button className='pr-2' >
           <ControlPointIcon sx={{ fontSize: 35 }}  aria-label="Add icon" />
          </button>
          <button>
           <CameraAltOutlinedIcon sx={{ fontSize: 35 }}  aria-label="Add icon" />
          </button>
        </div>
        {/* Right Side Icon */}
        <button >
           <ArrowCircleUpIcon sx={{ fontSize: 35 }}  aria-label="Add icon" />
          </button>
      </div>
  </div>
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
                <ExpandCircleDownOutlinedIcon sx={{ fontSize: 20 }}  aria-label="Expand menu" />
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
                  <p className="text-gray-700">{summary || "Summary will appear here"}</p>
                )}
              </div>
            </div>
   </main>  
   </div>   
  );
};

export default MainContent;
