// pages/api/generate.js
import { v4 as uuidv4 } from 'uuid';

/**
 * Robust JSON extraction and parsing function
 * Handles various edge cases in Claude's responses
 */


const getFormatGuidelines = (format) => {
  const guidelines = {
    'p5js': `
For p5.js visualization:
- Create a complete sketch with both setup() and draw() functions
- Use clear and meaningful variable names for better readability
- Add explanatory comments to clarify key functions and logic.
- Implement appropriate user interactions (mouse/keyboard)
- Use color effectively to highlight important elements
- Include animation that demonstrates dynamic principles
- Set the canvas size is appropriate (recommended: 400x400 pixels)
- Add visual indicators that explain what's happening
- Containing a valid p5.js code snippet
- Generated code should not have any errors make it valid code`,

'threejs': `
For three.js visualization:
-containing a valid three.js code snippet
-give the working code without any imports
-for postion use geometry.attributes.position instead of geometry.vertices`,


    'd3js': `
For D3.js visualization:
- Create a complete visualization with appropriate SVG elements to represent data effectively
- Use scales and axes appropriately when displaying data
- Implement interactions that reveal additional information
- Use color effectively to distinguish data categories
- Add transitions to show changes over time or between states
- Include appropriate labels or a legend to improve clarity and usability
- Ensure the visualization is self-explanatory`,

    'mermaidjs': `
For Mermaid.js diagram:
- Choose the most suitable diagram type for the concept (flowchart, sequence, class, state, etc.)
- Use clear and concise node labels to improve readability
- Organize nodes logically to show relationships or processes
- Use directional arrows to show flow,transistions or dependencies
- Include a clear starting point in process-based diagrams
- Keep the diagram focused on key elements (avoid excessive detail)
- Use comments to explain complex relationships if necessary`
  };

  return guidelines[format] || 'Create an educational visualization that clearly demonstrates the concept.';
};

/**
 * Enhanced prompt generator for visualization creation
 */
const createVisualizationPrompt = (inputType, content, format) => {
  return `You are an expert educational content creator specializing in converting concepts into interactive visualizations. Your task is to analyze the provided ${inputType} and generate code in ${format} that creates an effective educational visualization.

INPUT (${inputType}):
${content}

VISUALIZATION REQUIREMENTS:
1. Create executable code that clearly demonstrates the main educational concept
2. Focus on visual clarity and interactivity appropriate for learning
3. Include appropriate annotations or labels in the visualization
4. Ensure the code is complete and can run standalone in a browser environment
5. Design the visualization to be engaging for high school or undergraduate students

FORMAT-SPECIFIC GUIDELINES:
${getFormatGuidelines(format)}

EDUCATIONAL GOALS:
- The visualization should help students understand abstract concepts through visual representation
- Interactive elements should allow exploration of key principles
- The simulation should demonstrate cause-effect relationships where applicable
- Complexity should be appropriate for educational purposes (not overly simplified or complex)

OUTPUT FORMAT:
Return your response as a valid JSON object with the following structure. Do not include any explanation or text outside this JSON structure:

{
  "code": "function setup() {
      createCanvas(400, 400);
      angleMode(DEGREES);
    }

    function draw() {
      background(220);
      translate(width / 2, height / 2);

      let angle = frameCount % 360;
      let x = 100 * cos(angle);
      let y = 100 * sin(angle);

      fill(255, 0, 0);
      ellipse(x, y, 20, 20);

      stroke(0);
      line(0, 0, x, y);
    }",
  "summary": "This p5.js visualization illustrates circular motion using trigonometric functions. A red dot moves in a circular path, demonstrating the principles of sine and cosine in periodic motion. The visualization helps users understand how angles and coordinate transformations work together to create circular movement.",
  "conceptName": "Circular Motion",
  "keyPrinciples": ["Sine & Cosine Functions", "Periodic Motion", "Coordinate Transformation"],
  "interactivityNotes": "Users can observe how the red dot moves continuously in a circular path, with an optional interaction to pause/resume animation using a key press.",
  "learningObjectives": [
    "Understand how sine and cosine functions create circular motion.",
    "Learn about periodic motion and how it relates to angular displacement."
  ]
},
{
  "code": "import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let geometry = new THREE.SphereGeometry(0.5, 32, 32);
    let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    let sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      let angle = Date.now() * 0.002;
      sphere.position.x = 2 * Math.cos(angle);
      sphere.position.y = 2 * Math.sin(angle);
      renderer.render(scene, camera);
    }

    animate();",
  "summary": "This Three.js visualization demonstrates circular motion in a 3D space. A red sphere moves in a circular trajectory using cosine and sine functions, emphasizing periodic motion. Users can observe real-time 3D motion with accurate position updates.",
  "conceptName": "Circular Motion in 3D",
  "keyPrinciples": ["3D Coordinate System", "Sine & Cosine Functions", "Real-time Animation"],
  "interactivityNotes": "Users can rotate the view using mouse interactions (if OrbitControls is added). The animation loop continuously updates the sphere’s position.",
  "learningObjectives": [
    "Understand circular motion in 3D using trigonometry.",
    "Learn how to animate objects dynamically in Three.js."
  ]
},
{
  "code": "<!DOCTYPE html>
    <html>
    <head>
      <script src='https://d3js.org/d3.v6.min.js'></script>
    </head>
    <body>
      <svg width='400' height='400'>
        <circle id='movingCircle' cx='200' cy='200' r='10' fill='red'></circle>
      </svg>
      <script>
        let angle = 0;
        function animate() {
          let x = 200 + 100 * Math.cos(angle);
          let y = 200 + 100 * Math.sin(angle);
          d3.select('#movingCircle')
            .attr('cx', x)
            .attr('cy', y);
          angle += 0.05;
          requestAnimationFrame(animate);
        }
        animate();
      </script>
    </body>
    </html>",
  "summary": "This D3.js visualization demonstrates circular motion using an SVG circle that moves along a circular path. The animation updates the circle’s position dynamically using trigonometric functions.",
  "conceptName": "Circular Motion in SVG",
  "keyPrinciples": ["SVG Animation", "Sine & Cosine Functions", "Dynamic Data Visualization"],
  "interactivityNotes": "Users can observe the circle continuously moving along a circular path. Additional interactions like pausing or changing speed can be added.",
  "learningObjectives": [
    "Understand how to animate elements in SVG using D3.js.",
    "Learn how trigonometric functions create periodic motion."
  ]
},
{
  "code": "graph TD;
      A[Object in Circular Motion] --> B{Forces Acting}
      B -->|Centripetal Force| C[Directed Towards Center]
      B -->|Velocity| D[Changes Direction]
      D --> E[Object Keeps Moving in a Circle]
      E --> A;",
  "summary": "This Mermaid.js diagram visually explains the forces involved in circular motion. It highlights the role of centripetal force and velocity changes that keep an object moving in a circular path.",
  "conceptName": "Forces in Circular Motion",
  "keyPrinciples": ["Centripetal Force", "Velocity Change", "Continuous Motion"],
  "interactivityNotes": "This is a static diagram, but users can modify it by adding more nodes or changing relationships in Mermaid.js syntax.",
  "learningObjectives": [
    "Understand how forces like centripetal force maintain circular motion.",
    "Visualize the interaction between velocity and force in a circular path."
  ]
}`;
};

const extractAndParseJSON = (text) => {
  try {
    // First attempt: Try to parse directly if the response is already valid JSON
    try {
      return JSON.parse(text);
    } catch (e) {
      // If direct parsing fails, try to extract JSON from the text
      console.log("Direct JSON parsing failed, trying to extract JSON");
    }
    
    // Second attempt: Find JSON using regex
    const jsonRegex = /\{[\s\S]*\}/; // Match anything between curly braces including newlines
    const match = text.match(jsonRegex);
    
    if (match) {
      // Try to parse the extracted JSON
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        console.log("Extracted JSON is invalid, attempting to fix");
        // If the extracted JSON is still invalid, try to fix common issues
      }
    }
    
    // Third attempt: Fix common JSON issues and try again
    // 1. Replace unescaped quotes within string literals
    let fixedText = text.replace(/:"((?:[^"\\]|\\.)*)"/g, function(match) {
      // Replace any unescaped quotes within the JSON string with escaped quotes
      return match.replace(/(?<!\\)"/g, '\\"');
    });
    
    // 2. Try to extract with the fixed text
    const fixedMatch = fixedText.match(jsonRegex);
    if (fixedMatch) {
      try {
        return JSON.parse(fixedMatch[0]);
      } catch (e) {
        console.log("Fixed JSON is still invalid, using fallback extraction");
      }
    }
    
    // Fallback: Extract key-value pairs manually
    return extractKeyValuePairs(text);
    
  } catch (error) {
    console.error("JSON extraction and parsing failed:", error);
    // Return a structured error response
    return {
      error: "Failed to parse response",
      errorDetails: error.message,
      rawResponse: text.substring(0, 500) + "..." // Include part of the raw response for debugging
    };
  }
};

/**
 * Manual extraction of key-value pairs from response
 * Useful when JSON is malformed but structure is still evident
 */
const extractKeyValuePairs = (text) => {
  const result = {
    code: "",
    summary: "",
    conceptName: "",
    keyPrinciples: [],
    interactivityNotes: "",
    learningObjectives: []
  };
  
  // Extract the code block - this is usually the most problematic part
  const codeBlockMatch = text.match(/["']code["']\s*:\s*["']([\s\S]*?)["'],/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    result.code = codeBlockMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n');
  } else {
    // Try alternative code block pattern with triple backticks
    const codeBlockAltMatch = text.match(/["']code["']\s*:\s*["']```(?:javascript|js|html)?\s*([\s\S]*?)```["']/);
    if (codeBlockAltMatch && codeBlockAltMatch[1]) {
      result.code = codeBlockAltMatch[1];
    } else {
      // Last resort - look for code between certain markers
      const codeSection = text.match(/["']code["']\s*:\s*["']([\s\S]*?)["']/);
      if (codeSection && codeSection[1]) {
        result.code = codeSection[1];
      }
    }
  }
  
  // Extract other fields using more straightforward patterns
  const summaryMatch = text.match(/["']summary["']\s*:\s*["']([\s\S]*?)["']/);
  if (summaryMatch && summaryMatch[1]) {
    result.summary = summaryMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n');
  }
  
  const conceptMatch = text.match(/["']conceptName["']\s*:\s*["']([\s\S]*?)["']/);
  if (conceptMatch && conceptMatch[1]) {
    result.conceptName = conceptMatch[1];
  }
  
  // Extract arrays
  const principlesMatch = text.match(/["']keyPrinciples["']\s*:\s*\[([\s\S]*?)\]/);
  if (principlesMatch && principlesMatch[1]) {
    // Split by commas, but be careful about commas inside quotes
    const principles = principlesMatch[1].split(/,(?=\s*["'])/);
    result.keyPrinciples = principles.map(p => 
      p.trim().replace(/^["']|["']$/g, '')
    ).filter(p => p);
  }
  
  const interactivityMatch = text.match(/["']interactivityNotes["']\s*:\s*["']([\s\S]*?)["']/);
  if (interactivityMatch && interactivityMatch[1]) {
    result.interactivityNotes = interactivityMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n');
  }
  
  const objectivesMatch = text.match(/["']learningObjectives["']\s*:\s*\[([\s\S]*?)\]/);
  if (objectivesMatch && objectivesMatch[1]) {
    const objectives = objectivesMatch[1].split(/,(?=\s*["'])/);
    result.learningObjectives = objectives.map(o => 
      o.trim().replace(/^["']|["']$/g, '')
    ).filter(o => o);
  }
  
  return result;
};

/**
 * Enhanced Claude API call with improved error handling
 * and JSON parsing for code generation
 */
const callClaudeAPIWithRobustParsing = async (prompt, modelName = "claude-3-opus-20240229") => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: 4000,
        temperature: 0.2,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Claude API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    const rawResponse = data.content[0].text;
    
    // Use our enhanced JSON extraction and parsing
    const parsedResponse = extractAndParseJSON(rawResponse);
    
    // If we detected an error in parsing, add the raw response for debugging
    if (parsedResponse.error) {
      console.error("Error parsing Claude response:", parsedResponse.error);
      console.log("Raw response sample:", rawResponse.substring(0, 500) + "...");
      return {
        error: parsedResponse.error,
        errorDetails: parsedResponse.errorDetails,
        rawResponse: rawResponse
      };
    }
    
    return parsedResponse;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    return { error: error.message };
  }
};

/**
 * Modified prompt for better JSON structure with code
 * This helps prevent issues with code containing special characters
 */
const createCodeSafeVisualizationPrompt = (inputType, content, format) => {
  // The key change here is in the output format instructions
  return `You are an expert educational content creator specializing in converting concepts into interactive visualizations. Your task is to analyze the provided ${inputType} and generate code in ${format} that creates an effective educational visualization.

INPUT (${inputType}):
${content}

VISUALIZATION REQUIREMENTS:
1. Create executable code that clearly demonstrates the main educational concept
2. Focus on visual clarity and interactivity appropriate for learning
3. Include appropriate annotations or labels in the visualization
4. Ensure the code is complete and can run standalone in a browser environment
5. Design the visualization to be engaging for high school or undergraduate students

FORMAT-SPECIFIC GUIDELINES:
${getFormatGuidelines(format)}

EDUCATIONAL GOALS:
- The visualization should help students understand abstract concepts through visual representation
- Interactive elements should allow exploration of key principles
- The simulation should demonstrate cause-effect relationships where applicable
- Complexity should be appropriate for educational purposes (not overly simplified or complex)

OUTPUT FORMAT:
Return your response as a valid JSON object with the following structure. 
IMPORTANT: For the "code" field, ensure all quotes and special characters are properly escaped for JSON.
When including code, escape all double quotes with backslash (\\") and escape all newlines with \\n.
Do not include any explanation or text outside this JSON structure:

{
  "code": "// Complete, executable code here with all quotes and special characters properly escaped",
  "summary": "2-3 paragraph educational summary explaining the concept",
  "conceptName": "The main concept name",
  "keyPrinciples": ["Principle 1", "Principle 2", "Principle 3"],
  "interactivityNotes": "Brief explanation of how users can interact with the simulation",
  "learningObjectives": ["Learning objective 1", "Learning objective 2"]
}`;
};

/**
 * Implementation in the API route
 */
// In your /api/generate.js file:
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { source, input, format = 'p5js' } = req.body;
    
    if (!source || !input) {
      return res.status(400).json({ 
        success: false,
        error: "Missing required parameters: source and input" 
      });
    }
    
    const requestId = uuidv4();
    console.log(`Request ${requestId} started for ${source} with format ${format}`);
    
    // Process input as before...
    let processedInput = input;
    
    // Create the prompt with better JSON handling instructions
    const prompt = createCodeSafeVisualizationPrompt(source, processedInput, format);
    
    // Use the enhanced Claude API call with robust JSON parsing
    const startTime = Date.now();
    const claudeResponse = await callClaudeAPIWithRobustParsing(prompt);
    const endTime = Date.now();
    
    console.log(`Request ${requestId} completed in ${endTime - startTime}ms`);
    
    // Handle error in Claude response
    if (claudeResponse.error) {
      return res.status(500).json({
        success: false,
        error: `Error from Claude API: ${claudeResponse.error}`,
        details: claudeResponse.errorDetails || null,
        rawResponseSample: claudeResponse.rawResponse ? 
          claudeResponse.rawResponse.substring(0, 1000) + "..." : null
      });
    }
    
    // Process the code from the response
    let code = claudeResponse.code || "";
    
    // If the code is escaped, unescape it
    if (code.includes('\\n') || code.includes('\\"')) {
      code = code
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    }
    
    // Return the enhanced response
    return res.status(200).json({
      success: true,
      summary: claudeResponse.summary,
      codeOutputs: { [format]: code },
      concept: {
        name: claudeResponse.conceptName,
        principles: claudeResponse.keyPrinciples
      },
      interactivityNotes: claudeResponse.interactivityNotes || null,
      learningObjectives: claudeResponse.learningObjectives || []
    });
    
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
