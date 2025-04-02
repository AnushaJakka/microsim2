// Claude API Optimization for MicroSim

/**
 * This guide provides specific optimization techniques for using Claude API
 * in the MicroSim Learning application to reduce latency and improve quality.
 */

// 1. Prompt Engineering Best Practices
// -----------------------------------

/**
 * Structuring prompts for optimal results with Claude
 */

// Use structured JSON output format in prompts
const jsonOutputPrompt = `
Output your response in the following JSON format:
{
  "code": "// Your complete, executable code here",
  "summary": "Your educational summary here",
  "conceptName": "The main concept name",
  "keyPrinciples": ["Principle 1", "Principle 2", "Principle 3"]
}`;

// Set explicit expectations for code structure
const codeStructurePrompt = {
  'p5js': `
Ensure your p5.js code follows this structure:
- Include setup() function that creates a canvas
- Include draw() function that updates the visualization
- Use appropriate color schemes and visual elements
- Add inline comments explaining key concepts
- Make the visualization interactive with mouse or keyboard input where appropriate`,

  'threejs': `
Ensure your Three.js code follows this structure:
- Create a scene, camera, and renderer
- Set up proper lighting
- Create 3D objects that represent the concept
- Implement an animation loop
- Add camera controls for user interaction`,

  'd3js': `
Ensure your D3.js code follows this structure:
- Select the DOM element and create an SVG
- Define margins, width, and height
- Create scales appropriate for the data
- Add axes when relevant
- Implement data visualization with appropriate marks
- Add transitions for interactivity`,

  'mermaidjs': `
Ensure your Mermaid.js diagram follows this structure:
- Choose the appropriate diagram type (flowchart, sequence, class, state)
- Use clear and concise node labels
- Use meaningful relationship descriptions
- Organize nodes logically
- Include a clear starting point and flow direction`
};

// 2. Model Selection Strategy
// --------------------------

/**
 * Choosing the right Claude model for different tasks
 */
const modelSelectionStrategy = {
  // For quick initial responses (lower latency)
  quickResponses: "claude-3-haiku-20240307",
  
  // For high-quality code generation (main simulation)
  codeGeneration: "claude-3-opus-20240229",
  
  // For educational content (summaries, explanations)
  educationalContent: "claude-3-sonnet-20240229",
  
  // For MCQ generation (balanced speed/quality)
  mcqGeneration: "claude-3-sonnet-20240229"
};

// Choose model based on task complexity and latency requirements
function selectModelForTask(task, prioritizeSpeed = false) {
  if (prioritizeSpeed) {
    return modelSelectionStrategy.quickResponses;
  }
  
  switch (task) {
    case 'code':
      return modelSelectionStrategy.codeGeneration;
    case 'mcq':
      return modelSelectionStrategy.mcqGeneration;
    case 'summary':
      return modelSelectionStrategy.educationalContent;
    default:
      return modelSelectionStrategy.educationalContent;
  }
}

// 3. Progressive Loading Strategy
// ------------------------------

/**
 * Implementing progressive loading to improve perceived performance
 */

// Example implementation for progressive loading
async function generateWithProgressiveLoading(input, format) {
  // Start with a quick response using Haiku
  const quickResponsePromise = fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'text',
      input,
      format,
      model: modelSelectionStrategy.quickResponses
    })
  }).then(res => res.json());
  
  // In parallel, start a full quality response using Opus
  const fullResponsePromise = fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'text',
      input,
      format,
      model: modelSelectionStrategy.codeGeneration
    })
  }).then(res => res.json());
  
  // Show quick response first
  const quickResponse = await quickResponsePromise;
  updateUIWithResponse(quickResponse, true); // true indicates partial response
  
  // Then replace with full response when ready
  const fullResponse = await fullResponsePromise;
  updateUIWithResponse(fullResponse, false); // false indicates final response
  
  return fullResponse;
}

function updateUIWithResponse(response, isPartial) {
  // Update UI elements based on the response
  // If it's a partial response, show a loading indicator
  // If it's the final response, remove the loading indicator
}

// 4. Caching Implementation
// -----------------------

/**
 * Implementing an effective cache for Claude API responses
 */

// Simple in-memory cache for development
const responseCache = new Map();

// Function to get cached response or call API
async function getCachedOrFreshResponse(cacheKey, apiCallFunction) {
  // Check if response is in cache
  if (responseCache.has(cacheKey)) {
    console.log(`Cache hit for ${cacheKey}`);
    return responseCache.get(cacheKey);
  }
  
  // If not in cache, call API
  console.log(`Cache miss for ${cacheKey}`);
  const response = await apiCallFunction();
  
  // Store in cache
  responseCache.set(cacheKey, response);
  
  return response;
}

// Generate cache key based on input and format
function generateCacheKey(source, input, format) {
  // Use a hash function for long inputs
  const inputHash = typeof input === 'string' && input.length > 100
    ? hashString(input)
    : input;
  
  return `${source}-${inputHash}-${format}`;
}

// Simple string hashing function
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

// Example usage with cache
async function generateContentWithCache(source, input, format) {
  const cacheKey = generateCacheKey(source, input, format);
  
  return getCachedOrFreshResponse(cacheKey, async () => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, input, format })
    });
    
    return response.json();
  });
}

// 5. Claude API Performance Monitoring
// ----------------------------------

/**
 * Implementing monitoring for Claude API performance
 */

// Track API call performance
function trackAPIPerformance(apiName, startTime, endTime, success, details = {}) {
  const duration = endTime - startTime;
  
  // Log performance data
  console.log(`API call to ${apiName} took ${duration}ms (${success ? 'success' : 'failure'})`);
  
  // In a real application, send this data to your analytics service
  // Example: sendToAnalytics({ apiName, duration, success, ...details });
  
  // Return performance data for further use
  return {
    apiName,
    duration,
    success,
    timestamp: new Date().toISOString(),
    ...details
  };
}

// Example usage with performance tracking
async function generateWithPerformanceTracking(source, input, format) {
  const startTime = Date.now();
  let success = false;
  let errorMessage = null;
  
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, input, format })
    });
    
    const data = await response.json();
    
    if (data.success) {
      success = true;
      return data;
    } else {
      errorMessage = data.error;
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  } finally {
    const endTime = Date.now();
    trackAPIPerformance('generateContent', startTime, endTime, success, {
      source,
      format,
      errorMessage,
      inputLength: typeof input === 'string' ? input.length : 'non-string',
    });
  }
}

// 6. Advanced Prompt Techniques
// ---------------------------

/**
 * Advanced prompt techniques for specific scenarios
 */

// Technique 1: Chain-of-thought for complex visualizations
function createChainOfThoughtPrompt(concept) {
  return `Let's think step by step about how to visualize the concept of ${concept}.

Step 1: Identify the key principles or components of ${concept}.
Step 2: Determine which aspects are most important to visualize.
Step 3: Consider how to represent these visually (shapes, colors, motion).
Step 4: Plan the user interactions that would enhance understanding.
Step 5: Design the code structure to implement this visualization.

Now, based on these steps, please generate code that visualizes ${concept}.`;
}

// Technique 2: Few-shot learning for better code generation
function createFewShotPrompt(format, concept) {
  // Few-shot examples help Claude understand the expected output format
  const examples = {
    'p5js': `
Example 1: Visualizing Gravity

\`\`\`javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  // Visualization code here
}
\`\`\`

Example 2: Visualizing Wave Interference

\`\`\`javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  // Visualization code here
}
\`\`\`
`
  };
  
  return `I'll provide some examples of good ${format} visualizations, then ask you to create one for a new concept.

${examples[format] || ''}

Now, please create a ${format} visualization for the concept of ${concept}.`;
}

// 7. Error Recovery Strategies
// --------------------------

/**
 * Strategies for handling API errors and malformed responses
 */

// Retry logic for API calls
async function callWithRetry(apiFunction, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiFunction();
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error);
      lastError = error;
      
      if (attempt < maxRetries) {
        // Wait before retrying (with exponential backoff)
        const backoffDelay = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  throw lastError;
}

// Example usage with retry logic
async function generateContentWithRetry(source, input, format) {
  return callWithRetry(async () => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, input, format })
    });
    
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown API error');
    }
    
    return data;
  });
}

// Fix malformed JSON in Claude responses
function extractValidJSON(text) {
  // Try to find a JSON object in the text
  const jsonRegex = /{[\s\S]*}/;
  const match = text.match(jsonRegex);
  
  if (match) {
    try {
      // Try to parse the matched JSON
      return JSON.parse(match[0]);
    } catch (e) {
      console.warn('Failed to parse matched JSON:', e);
    }
  }
  
  // If no valid JSON found, try to extract structured data
  const keyValuePairs = extractKeyValuePairs(text);
  return keyValuePairs;
}

function extractKeyValuePairs(text) {
  const result = {};
  
  // Look for "key": "value" or "key": value patterns
  const lines = text.split('\n');
  
  for (const line of lines) {
    const keyValueMatch = line.match(/"([^"]+)":\s*(?:"([^"]+)"|(\[[^\]]+\])|([^,}\s]+))/);
    
    if (keyValueMatch) {
      const key = keyValueMatch[1];
      // Use the first non-undefined value from the captured groups
      const value = keyValueMatch[2] || keyValueMatch[3] || keyValueMatch[4];
      
      // Try to parse arrays or objects
      if (value.startsWith('[') || value.startsWith('{')) {
        try {
          result[key] = JSON.parse(value);
        } catch (e) {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    }
  }
  
  return result;
}

// Export the functions for use in the application
export {
  selectModelForTask,
  generateWithProgressiveLoading,
  generateContentWithCache,
  generateWithPerformanceTracking,
  createChainOfThoughtPrompt,
  createFewShotPrompt,
  generateContentWithRetry,
  extractValidJSON
};
