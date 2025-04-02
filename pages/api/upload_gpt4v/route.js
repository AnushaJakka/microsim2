// Initialize the Anthropic client (Claude AI)
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Logging the start of the image processing API call
    console.log('Starting the image processing API call');
    
    // Extracting the file (in base64 format) and format from the request body
    const { file: base64Image, formate } = req.body;
    console.log(`Requested format: ${formate}`);
    
    // Check if the image file is included in the request. If not, return an error response.
    if (!base64Image) {
      console.error('No file found in the request');
      return res.status(400).json({ success: false, message: 'No file found' });
    }
    
    // Log the receipt of the image in base64 format
    console.log('Received image in base64 format');
    
    // Construct prompt based on the requested format
    let promptText;
    
    if (formate === "p5js") {
      promptText = "Given image is the flashcard that contains prompt name, prompt, prompt image, Wikipedia link related to prompt. Your task is to generate p5.js code that is ready to run in compiler. Do not explain anything, answer only in JSON with keys prompt_name: prompt name, prompt: prompt, wikipedia_link, summary: summary based on prompt name, code: code. Give only JSON without any ```json```";
    } else if (formate === "threejs") {
      promptText = "Given an image of a flashcard containing prompt name, prompt text, prompt image, and Wikipedia link, generate Three.js code ready to run in a compiler. Return ONLY a valid, properly escaped JSON object with these keys: prompt_name, prompt, wikipedia_link, summary, and code. For the code, provide working Three.js code without imports, using geometry.attributes.position instead of geometry.vertices. Ensure all special characters in strings are properly escaped according to JSON standards, with no control characters, line breaks, or formatting that would invalidate the JSON structure. The response must be parseable by JSON.parse() without errors."
    } else if (formate === "d3js") {
      promptText = "Given image is the flashcard that contains prompt name, prompt, prompt image, Wikipedia link related to prompt. Your task is to generate d3js code that is ready to run in a browser. Do not explain anything, answer only in JSON with keys prompt_name: prompt name, prompt: prompt, wikipedia_link, summary: summary based on prompt name, code: code. Give only JSON without any ```json```";
    } else if (formate === "mermaidjs") {
      promptText = "Given image is the flashcard that contains prompt name, prompt, prompt image, Wikipedia link related to prompt. Your task is to generate mermaid code that is ready to run in a complier. Do not explain anything, answer only in JSON with keys prompt_name: prompt name, prompt: prompt, wikipedia_link, summary: summary based on prompt name, code: code. Give only JSON without any ```json```";
    } else {
      // Default to p5.js if format is not specified or unknown
      promptText = "Given image is the flashcard that contains prompt name, prompt, prompt image, Wikipedia link related to prompt. Your task is to generate p5.js code that is ready to run in compiler. Do not explain anything, answer only in JSON with keys prompt_name: prompt name, prompt: prompt, wikipedia_link, summary: summary based on prompt name, code: code. Give only JSON without any ```json```";
    }
    
    // Log the chosen prompt
    console.log(`Using prompt: ${promptText}`);
    
    // Sending the image and prompt to Claude for processing
    console.log('Sending request to Claude AI');
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219", // Using Claude's most capable model
        max_tokens: 4000, // Increased to accommodate larger code responses
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: promptText
              },
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg", // Adjust based on your image type
                  data: base64Image.replace(/^data:image\/\w+;base64,/, "") // Remove the prefix if it exists
                }
              }
            ]
          }
        ]
      });
      
      // Log the response received from Claude
      console.log('Received response from Claude AI');
      
      // Extract and log the analysis from the response
      const analysis = response.content[0].text;
      console.log('Analysis received, length:', analysis.length);
      
      // Parse the JSON to validate it's complete
      try {
        const jsonObject = JSON.parse(analysis);
        
        // Return the parsed object directly
        return res.status(200).json({
          success: true,
          prompt_name: jsonObject.prompt_name,
          prompt: jsonObject.prompt,
          wikipedia_link: jsonObject.wikipedia_link,
          summary: jsonObject.summary,
          p5jsCode: jsonObject.code // Return the code directly with a more generic name
        });
      } catch (parseError) {
        console.error('Error parsing JSON from Claude:', parseError);
        return res.status(500).json({
          success: false,
          message: 'Received incomplete or invalid JSON from Claude'
        });
      }
    } catch (error) {
      // Log and handle any errors encountered during the request to Claude
      console.error('Error sending request to Claude AI:', error);
      return res.status(500).json({ success: false, message: 'Error sending request to Claude AI' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}