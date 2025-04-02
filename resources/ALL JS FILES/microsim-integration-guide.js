// MicroSim Application Integration Guide

/**
 * This guide explains how to integrate all the components of the MicroSim
 * Learning application together into a cohesive application.
 */

// File Structure
// --------------
/*
/microsim/
  ├── pages/
  │   ├── index.js         // Main application entry point
  │   ├── api/
  │   │   ├── generate.js  // API handler for content generation
  │   │   └── generate-mcq.js // API handler for MCQ generation
  │
  ├── components/
  │   ├── SimulationRenderer.js  // The simulation rendering component
  │   ├── MCQComponent.js        // The MCQ quiz component
  │   └── ... (other UI components)
  │
  ├── lib/
  │   ├── claude-api.js          // API integration with Claude
  │   └── prompt-templates.js    // Prompt templates for Claude
  │
  ├── public/
  │   └── ... (static assets)
  │
  └── ... (config files)
*/

// Integration Steps
// ----------------

// 1. Set up Next.js project with Tailwind CSS
/*
   npx create-next-app microsim
   cd microsim
   npm install tailwindcss postcss autoprefixer
   npx tailwindcss init -p
*/

// 2. Set up environment variables in .env.local
/*
   CLAUDE_API_KEY=your_api_key_here
   NEXT_PUBLIC_API_BASE_URL=/api
*/

// 3. Create the API integration functions in lib/claude-api.js
/**
 * This file handles API requests to Claude
 */
// lib/claude-api.js
export async function callClaudeAPI(prompt, modelName = "claude-3-opus-20240229") {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
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
    
    // Parse JSON from Claude's response
    try {
      const jsonMatch = data.content[0].text.match(/({[\s\S]*})/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { 
        error: "Failed to parse JSON from response",
        rawResponse: data.content[0].text  
      };
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return { 
        error: error.message,
        rawResponse: data.content[0].text
      };
    }
  } catch (error) {
    console.error("Error calling Claude API:", error);
    return { error: error.message };
  }
}

// 4. Create the prompt templates in lib/prompt-templates.js
/**
 * This file contains the prompt templates for Claude
 */
// lib/prompt-templates.js
export const createBasePrompt = (inputType, content, format) => {
  const systemInstruction = `You are an expert educational content creator specializing in converting concepts into interactive visualizations using ${format}. Your task is to analyze the provided ${inputType} and generate code, summary, and educational content.`;
  
  const formatGuidelines = {
    'p5js': 'Create an interactive p5.js sketch with setup() and draw() functions. Focus on visual clarity and educational value.',
    'threejs': 'Create a Three.js visualization with scene, camera, lighting, and animation loop. Ensure the 3D representation is educational.',
    'd3js': 'Create a D3.js visualization that represents data relationships clearly. Include proper scales and axes when appropriate.',
    'mermaidjs': 'Create a Mermaid.js diagram that clearly shows the structure, process, or relationships in the concept.'
  };
  
  return `${systemInstruction}

INPUT (${inputType}):
${content}

INSTRUCTIONS:
1. Analyze the input and identify the core educational concept.
2. Generate executable ${format} code that visualizes this concept effectively.
3. Provide a concise summary (2-3 paragraphs) explaining the concept for learners.
4. Ensure the visualization is interactive and demonstrates key principles.

FORMAT GUIDELINES:
${formatGuidelines[format] || 'Create an educational visualization that clearly demonstrates the concept.'}

Output your response in the following JSON format:
{
  "code": "// Your complete, executable code here",
  "summary": "Your educational summary here",
  "conceptName": "The main concept name",
  "keyPrinciples": ["Principle 1", "Principle 2", "Principle 3"]
}`;
};

export const createMcqPrompt = (summary, conceptName, principles) => {
  return `You are an expert educational assessment creator. Your task is to create high-quality multiple-choice questions based on the following educational content.

CONCEPT: ${conceptName || 'The topic provided in the summary'}

KEY PRINCIPLES:
${principles ? principles.map(p => `- ${p}`).join('\n') : 'Extract key principles from the summary'}

SUMMARY:
${summary}

INSTRUCTIONS:
1. Create 5 multiple-choice questions that test understanding of the concept and principles.
2. Each question should have 4 options (A, B, C, D) with only one correct answer.
3. Questions should assess different cognitive levels (knowledge, understanding, application, analysis).
4. Include a brief explanation for why the correct answer is right.
5. Avoid overly technical language and ensure questions are appropriate for high school or undergraduate students.

Output your response in the following JSON format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation for why the answer is correct"
    },
    // Additional questions following the same format
  ]
}`;
};

// 5. Create the API endpoint for content generation in pages/api/generate.js
/**
 * API endpoint for generating content from different inputs
 */
// pages/api/generate.js
import { callClaudeAPI } from '../../lib/claude-api';
import { createBasePrompt } from '../../lib/prompt-templates';

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
    
    // Process input based on source
    let processedInput = input;
    
    // Create appropriate prompt based on source
    let prompt = createBasePrompt(source, processedInput, format);
    
    // Generate response from Claude
    const claudeResponse = await callClaudeAPI(prompt);
    
    // Handle error in Claude response
    if (claudeResponse.error) {
      return res.status(500).json({
        success: false,
        error: `Error from Claude API: ${claudeResponse.error}`,
        details: claudeResponse.rawResponse || null
      });
    }
    
    // Return the formatted response
    return res.status(200).json({
      success: true,
      summary: claudeResponse.summary,
      codeOutputs: { [format]: claudeResponse.code },
      concept: {
        name: claudeResponse.conceptName,
        principles: claudeResponse.keyPrinciples
      }
    });
    
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// 6. Create the API endpoint for MCQ generation in pages/api/generate-mcq.js
/**
 * API endpoint for generating MCQs from summaries
 */
// pages/api/generate-mcq.js
import { callClaudeAPI } from '../../lib/claude-api';
import { createMcqPrompt } from '../../lib/prompt-templates';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { summary, concept } = req.body;
    
    if (!summary) {
      return res.status(400).json({ 
        success: false,
        error: "Missing required parameter: summary" 
      });
    }
    
    // Create prompt for MCQ generation
    const prompt = createMcqPrompt(summary, concept?.name, concept?.principles);
    
    // Generate MCQs using Claude
    const claudeResponse = await callClaudeAPI(prompt, "claude-3-sonnet-20240229");
    
    // Handle error in Claude response
    if (claudeResponse.error) {
      return res.status(500).json({
        success: false,
        error: `Error from Claude API: ${claudeResponse.error}`,
        details: claudeResponse.rawResponse || null
      });
    }
    
    // Return the generated MCQs
    return res.status(200).json({
      success: true,
      mcq: claudeResponse
    });
    
  } catch (error) {
    console.error('Error generating MCQs:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// 7. Combine all the components in the main application (pages/index.js)
/**
 * The main MicroSim application component that integrates all parts
 */
// pages/index.js
import { useState, useEffect } from 'react';
import SimulationRenderer from '../components/SimulationRenderer';
import MCQComponent from '../components/MCQComponent';

// Import the rest of your components and implement the full application
// using the components from the artifacts we've created

// 8. Testing and Deployment
/**
 * Steps for testing and deployment:
 * 
 * 1. Local Testing:
 *    - Run `npm run dev` to start the development server
 *    - Test the application with various inputs
 *    - Verify that the Claude API integration works properly
 * 
 * 2. Deployment Options:
 *    - Vercel: Easy deployment for Next.js applications
 *      - Connect your GitHub repository
 *      - Set up environment variables (CLAUDE_API_KEY)
 *      - Deploy automatically on pushes to main branch
 * 
 *    - AWS/GCP/Azure:
 *      - Build the application: `npm run build`
 *      - Deploy to your preferred cloud provider
 *      - Set up environment variables
 */

// 9. Production Considerations
/**
 * Important considerations for production:
 * 
 * 1. API Key Security:
 *    - Never expose your Claude API key on the client side
 *    - Always make API requests through your backend
 * 
 * 2. Rate Limiting:
 *    - Implement rate limiting to prevent abuse
 *    - Consider using a service like Upstash or Redis
 * 
 * 3. Caching:
 *    - Cache commonly requested content to reduce API costs
 *    - Use a solution like Redis or a CDN
 * 
 * 4. Error Handling:
 *    - Implement robust error handling and reporting
 *    - Use a service like Sentry for monitoring
 * 
 * 5. Analytics:
 *    - Track usage patterns to improve the application
 *    - Consider using a service like Mixpanel or Google Analytics
 */

// 10. Future Enhancements
/**
 * Potential future enhancements:
 * 
 * 1. User Authentication:
 *    - Add user accounts to save progress and simulations
 *    - Use NextAuth.js or a similar authentication solution
 * 
 * 2. More Visualization Formats:
 *    - Add support for more visualization libraries
 *    - Consider formats like WebGL, SVG, etc.
 * 
 * 3. Social Features:
 *    - Allow users to share their simulations
 *    - Add commenting and collaboration features
 * 
 * 4. Custom Prompt Templates:
 *    - Allow educators to create custom prompt templates
 *    - Create a template builder interface
 * 
 * 5. Improved MCQ Generation:
 *    - Add support for different question types
 *    - Implement adaptive testing based on user performance
 */
