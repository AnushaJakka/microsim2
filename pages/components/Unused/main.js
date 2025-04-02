
import { useState, useCallback, useEffect } from "react";
import ImageUploader from "./imageuploder";






export default function Home() {
  const [result, setResult] = useState("// type a text prompt or provide flashcard above and click 'Generate Microsim'");
  const [textInput, setTextInput] = useState("");
  const [waiting, setWaiting] = useState(false);







  const [selectPrompt,setselectPrompt] = useState(""); //for selecting prompt in Remix
  const [file, setFile] = useState(null); // Holds the selected image file
  const [preview, setPreview] = useState(''); // URL for the image preview
  const [analysisresult, setanalysisResult] = useState(''); // Stores the analysis result
  const [uploadProgress, setUploadProgress] = useState(0); // Manages the upload progress
  const [statusMessage, setStatusMessage] = useState(''); // Displays status messages to the user
  const [dragOver, setDragOver] = useState(false); // UI state for drag-and-drop
  const [base64Image, setBase64Image] = useState('');

  
  const Remix = [
    {
      value: "Review",
      prompt: "You are an expert P5.js engineer with advanced degrees in Computation, Robotics, Engineering, Audio, Television and Energy domains.you are provided with a flashcard that has three items one is a prompt,second is an Image,lastly wikipedia and p5.js links,all these things describes a concept.You are also provided with a P5.js code at the end.Now,your task is to review the code, check for any errors and consider a different approach to this P5.js visualization described in flashcard.Answer only in code,do not try to explain.And the code you have to work is as follows:",
    },
    {
      value: "Controls",
      prompt: "You are an expert P5.js engineer with advanced degrees in Computation, Robotics, Engineering, Audio, Television and Energy domains.you are provided with a flashcard that has three items one is a prompt,second is an Image,lastly wikipedia and p5.js links,all these things describes a concept.You are also provided with a P5.js code at the end.Provided code is pretty cool and close to what I was looking for.Now,your task is to add inline controls to adjust key parameters.Answer only in code,do not try to explain.And the code you have to work is as follows:",
    },
    {
      value: "Simplify",
      prompt: "You are an expert P5.js engineer with advanced degrees in Computation, Robotics, Engineering, Audio, Television and Energy domains.you are provided with a flashcard that has three items one is a prompt,second is an Image,lastly wikipedia and p5.js links,all these things describes a concept.You are also provided with a P5.js code at the end.Now,your task is to re-evaluate provided code and described concept in flashcard.And it seems like a simpler approach may help make a more effective visualization.Answer only in code,do not try to explain.And the code you have to work is as follows:",
    },
    {
      value: "Chunk",
      prompt: "You are an expert P5.js engineer with advanced degrees in Computation, Robotics, Engineering, Audio, Television and Energy domains.you are provided with a flashcard that has three items one is a prompt,second is an Image,lastly wikipedia and p5.js links,all these things describes a concept.You are also provided with a P5.js code at the end.Now,your task is to re-evaluate provided code and described concept in flashcard.And it seems like a simpler approach may help make a more effective visualization and consider chunking the concept and try coding a smaller, single serving P5.js visualization based on a key concept.Answer only in code,do not try to explain.And the code you have to work is as follows:",
    },
    {
      value: "Get Creative",
      prompt: "You are an expert P5.js engineer with advanced degrees in Computation, Robotics, Engineering, Audio, Television and Energy domains.you are provided with a flashcard that has three items one is a prompt,second is an Image,lastly wikipedia and p5.js links,all these things describes a concept.You are also provided with a P5.js code at the end.The provided code is not working good.Now,your task is to review the concept and try a fun, silly or creative approach but with serious consideration of the P5.js library to make sure it works.Answer only in code,do not try to explain.And the code you have to work is as follows:",
    },
  ]

  const handleFileChange = useCallback(async (selectedFile) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setStatusMessage('Image selected. Click "Analyze Image" to proceed.');
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(reader.result.toString());
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setWaiting(true);
    setResult("// Please be patient, this may take a while...");
    if (!file) {
      setStatusMessage('No file selected!');
      return;
    }

    setStatusMessage('Sending request...');
    setUploadProgress(40);

    const response = await fetch('/api/upload_gpt4v/route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64Image,
      }),
    });

    setUploadProgress(60);

    // Check if the response status is in the range of 200 to 299
    if (response.ok) {
      try {
        const apiResponse = await response.json();
        setUploadProgress(80);

        if (apiResponse.success) {
          setanalysisResult(apiResponse.analysis);
          setStatusMessage('Analysis complete.');
          setUploadProgress(100);
          const analysisObject = JSON.parse(apiResponse.analysis); 
          const coderesult = analysisObject.code; 
          console.log(coderesult)
          setResult(coderesult);
          setSandboxRunning(true);
          setWaiting(false);
        } else {
          setStatusMessage(apiResponse.message);
        }
      } catch (error) {
        console.error(error);
        setStatusMessage('Error parsing response.');
      }
    } else {
      // Handle the case where the response status is not in the OK range
      setStatusMessage(`HTTP error! status: ${response.status}`);
    }
  };
  
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (!analysisresult || !file) {
      alert('No analysis result or file to save.');
      return;
    }
  
    // Parse the analysisresult JSON string into an object
    const analysisObject = JSON.parse(analysisresult);
    
  
    try {
      // Prepare the payload with the parsed data and the SVG
      const payload = {
        prompt_name: analysisObject.prompt_name,
        prompt: analysisObject.prompt,
        wikipedia_link: analysisObject.wikipedia_link,
        code: analysisObject.code,
        imageBase64: base64Image
        // flashcard_svg: svgData // This should be the SVG data as a string
      };
  
      // Send the payload to your backend for saving to the database
      const response = await fetch('/api/savePrompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('Record saved successfully!');
        setIsSaved(true);
        // Handle success, maybe clear state or redirect
      } else {
        // Handle errors
        alert(`Failed to save record: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving record:', error);
      alert('Error saving record.');
    }
  };  

  const PromptChange = async (event) => {
    event.preventDefault();
    setselectPrompt(event.target.value);
    const prompt = event.target.value;    
    console.log(prompt);
    setWaiting(true);
    setResult("// Please be patient, this may take a while...");
    if (!file) {
      setStatusMessage('No file selected!');
      return;
    }

    setStatusMessage('Sending request...');
    setUploadProgress(40);

    const response = await fetch('/api/remix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64Image,
	      prompt: prompt,
      }),
    });

    setUploadProgress(60);

    // Check if the response status is in the range of 200 to 299
    if (response.ok) {
      try {
        const apiResponse = await response.json();
        setUploadProgress(80);

        if (apiResponse.success) {
          setanalysisResult(apiResponse.analysis);
          setStatusMessage('Analysis complete.');
          setUploadProgress(100);
          const coderesult = apiResponse.analysis;
          const extractedCode = coderesult.slice(14, -3);
          setResult(extractedCode);
          setSandboxRunning(true);
          setWaiting(false);
        } else {
          setStatusMessage(apiResponse.message);
        }
      } catch (error) {
        console.error(error);
        setStatusMessage('Error parsing response.');
      }
    } else {
      // Handle the case where the response status is not in the OK range
      setStatusMessage(`HTTP error! status: ${response.status}`);
    }
  };

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setDragOver(false);
    const files = event.dataTransfer.files;
    if (files.length) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

//   useEffect(() => {
//     let ranOnce = false;

//     const handler = event => {
//       const data = JSON.parse(event.data)
//       if (!ranOnce) {
//         setlogMsg(data.logMsg);
//         ranOnce = true;
//       } else {
//         setlogMsg(msg => msg + '\n' + data.logMsg);
//       }
//     }

//     window.addEventListener("message", handler)

//     // clean up
//     return () => window.removeEventListener("message", handler)
//   }, [result, sandboxRunning])

  


  return (
    <>
<div>
<ImageUploader
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleFileChange={handleFileChange}
              preview={preview}
              uploadProgress={uploadProgress}
              handleSubmit={handleSubmit}
              statusMessage={statusMessage}
              analysisresult={analysisresult}
              dragOver={dragOver}
              Remix={Remix}
              selectPrompt={selectPrompt}
              PromptChange={PromptChange}
            />
          
            {/* Conditionally render the Save button */}
            {analysisresult && (
        <button
          className={`bg-emerald-500 p-2 rounded w-full text-white text-sm px-3 cursor-pointer ${isSaved ? 'bg-gray-500' : ''}`}
          onClick={handleSave}
          disabled={isSaved} // Disable the button based on isSaved state
        >
          {isSaved ? 'Saved to Database' : 'Save'} {/* Change button text based on isSaved state */}
        </button>
      )}
</div>

        
    </>
  );
}