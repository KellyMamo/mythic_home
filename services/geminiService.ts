import { GoogleGenAI } from "@google/genai";

function getApiKey(): string {
  return (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
}

function getClient(): GoogleGenAI | null {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export async function getDesignConsultation(prompt: string): Promise<string> {
  const client = getClient();
  if (!client) {
    return "Gemini is disabled because no API key is configured.";
  }

  const response = await client.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
  });

  return (
    (response as any)?.text ||
    (response as any)?.response?.text?.() ||
    "No response from Gemini."
  );
}

export async function analyzeHouseImage(
  imageBase64: string,
  prompt: string = "Analyze this house image."
): Promise<string> {
  const client = getClient();
  if (!client) {
    return "Gemini image analysis is disabled because no API key is configured.";
  }

  const base64 = imageBase64.includes("base64,")
    ? imageBase64.split("base64,")[1]
    : imageBase64;

  const response = await client.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      { text: prompt },
      {
        inlineData: {
          data: base64,
          mimeType: "image/png",
        },
      } as any,
    ],
  });

  return (
    (response as any)?.text ||
    (response as any)?.response?.text?.() ||
    "No response from Gemini."
  );
}