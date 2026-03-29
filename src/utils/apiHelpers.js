import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT_ENHANCE, SYSTEM_PROMPT_ANALYZE } from './constants';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "dummy_key");

export const getEnhancedPrompt = async (input) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const fullPrompt = `${SYSTEM_PROMPT_ENHANCE}\n\nUser Request: ${input}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Enhancement failed:', error);
    throw new Error(`Failed to enhance prompt. (${error.message || 'Check API key/quota'})`);
  }
};

export const analyzeImage = async (base64Data, mimeType) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // The base64Data comes as a data URL, so we extract just the base64 string
    const base64String = base64Data.split(',')[1] || base64Data;
    
    const imageParts = [
      {
        inlineData: {
          data: base64String,
          mimeType: mimeType || 'image/jpeg',
        },
      },
    ];

    const result = await model.generateContent([SYSTEM_PROMPT_ANALYZE, ...imageParts]);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Analysis failed:', error);
    throw new Error(`Failed to analyze image. (${error.message || 'Check API key/quota'})`);
  }
};

export const generateImage = async (prompt) => {
  // If HF token is available and configured, use it. Otherwise, use a free open proxy like Pollinations as a fallback.
  if (HF_TOKEN && HF_TOKEN !== 'your_huggingface_token_here') {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );
      
      if (!response.ok) {
        throw new Error('HF API responded with ' + response.status);
      }
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('HF Generation failed, falling back to public API:', error);
      // Fallback below
    }
  }
  
  // Public fallback API
  console.log("Using public image generation fallback.");
  const encodedPrompt = encodeURIComponent(prompt);
  // Add a random seed to bypass caching sometimes
  const seed = Math.floor(Math.random() * 1000000);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seed}`;
  
  return new Promise((resolve) => {
    // We fetch it to get a blob, or simply return the URL. 
    // Returning the URL directly works perfectly for Image tags.
    resolve(imageUrl);
  });
};
