
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client using the API key exclusively from process.env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDesignConsultation = async (userDescription: string) => {
  try {
    // Use gemini-3-pro-preview for complex reasoning tasks like architectural consulting.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `User wants advice on a house design. Description: "${userDescription}". 
      Respond as a professional architect. Give specific advice on architectural styles, 
      room layout trends, and energy efficiency. Keep it under 200 words.`,
      config: {
        systemInstruction: "You are a world-class senior architectural consultant for a premium house plan marketplace.",
        temperature: 0.7,
      },
    });
    // Use the .text property to access the generated content string.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my design database right now. Please try again soon!";
  }
};

export const analyzeHouseImage = async (base64Image: string) => {
  try {
    // Use gemini-3-pro-preview for complex multimodal architectural analysis.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "Describe the architectural style of this house. What are its key features? Suggest similar styles that might interest the user."
          }
        ]
      },
      config: {
        systemInstruction: "You are an AI Architectural Critic.",
      }
    });
    // Use the .text property to access the generated content string.
    return response.text;
  } catch (error) {
    console.error("Gemini Image Error:", error);
    return "Could not analyze this image. Please ensure it shows a clear house exterior.";
  }
};
