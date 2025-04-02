// pages/api/generate-mcq.js
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates an enhanced prompt for generating multiple-choice questions
 * that leverages learning objectives for better educational alignment
 */
const createEnhancedMcqPrompt = (summary, conceptName, principles, learningObjectives) => {
  return `You are an expert educational assessment creator specializing in creating high-quality multiple-choice questions for learning platforms. Your task is to create questions based on the following educational content.

CONCEPT: ${conceptName || 'The topic provided in the summary'}

KEY PRINCIPLES:
${principles ? principles.map(p => `- ${p}`).join('\n') : 'Extract key principles from the summary'}

LEARNING OBJECTIVES:
${learningObjectives && learningObjectives.length > 0 
  ? learningObjectives.map(obj => `- ${obj}`).join('\n')
  : 'Create appropriate learning objectives based on the summary'}

SUMMARY:
${summary}

ASSESSMENT REQUIREMENTS:
1. Create 5 multiple-choice questions that directly align with the learning objectives
2. Each question should have 4 options (A, B, C, D) with only one correct answer
3. Questions should assess different cognitive levels according to Bloom's Taxonomy:
   - Knowledge/Recall (1 question)
   - Comprehension/Understanding (1-2 questions)
   - Application/Analysis (1-2 questions)
   - Evaluation/Synthesis (1 question if appropriate for the topic)
4. Include a brief explanation for why the correct answer is right
5. Ensure questions test conceptual understanding rather than mere factual recall
6. Make questions appropriate for high school or undergraduate students
7. Include at least one question that tests the ability to interpret the visualization

OUTPUT FORMAT:
Return your response as a valid JSON object with the following structure. Do not include any explanation or text outside this JSON structure:

{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation for why the answer is correct",
      "bloomsLevel": "Knowledge/Comprehension/Application/Analysis/Evaluation/Synthesis",
      "relatedLearningObjective": "The specific learning objective this question addresses"
    },
    // Additional questions following the same format
  ]
}`;
};

/**
 * Makes a call to Claude API
 */
const callClaudeAPI = async (prompt, modelName = "claude-3-sonnet-20240229") => {
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
        temperature: 0.3, // Slightly higher temperature for more diverse questions
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
};

/**
 * Main API handler for generating MCQs
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { summary, concept, interactivityNotes, learningObjectives } = req.body;
    
    if (!summary) {
      return res.status(400).json({ 
        success: false,
        error: "Missing required parameter: summary" 
      });
    }
    
    const requestId = uuidv4();
    console.log(`MCQ Request ${requestId} started`);
    
    // Create enhanced prompt for MCQ generation
    const prompt = createEnhancedMcqPrompt(
      summary, 
      concept?.name, 
      concept?.principles,
      learningObjectives
    );
    
    // Generate MCQs using Claude
    const startTime = Date.now();
    const claudeResponse = await callClaudeAPI(prompt);
    const endTime = Date.now();
    
    console.log(`MCQ Request ${requestId} completed in ${endTime - startTime}ms`);
    
    // Handle error in Claude response
    if (claudeResponse.error) {
      return res.status(500).json({
        success: false,
        error: `Error from Claude API: ${claudeResponse.error}`,
        details: claudeResponse.rawResponse || null
      });
    }
    
    // Return the generated MCQs with enhanced metadata
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
