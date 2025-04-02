import axios from "axios";

const  fetchVisualization = async(input) =>{
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("API key is missing.");
    return null;
  }


    try {
      const res = await axios.post(
        "https://api.anthropic.com/v1/messages",
        {
          prompt: `Human: Provide a structured JSON response for the topic "${input}". The JSON should have the following keys:
          - "p5.js": containing a valid p5.js code snippet.
          - "three.js": containing a valid three.js code snippet.
          - "d3.js": containing a valid d3.js code snippet.
          - "summary": a concise summary of the topic.
          
          Ensure the response is strictly in JSON format.
          Assistant:`,
          model: "claude-3-7-sonnet-20250219",
         max_tokens: 4000,
        },
        {
          headers: {
            "x-api-key": process.env.ANTHROPIC_API_KEY, 
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01",
          },
        }
      );

      // Parse JSON response from Claude
      const jsonResponse = JSON.parse(res.data.completion);
      return jsonResponse
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  




}

export default fetchVisualization

// Example usage:
//  fetchVisualization("concept", "Conway's Game of Life").then(data => console.log(data));