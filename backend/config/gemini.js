import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
let key = process.env.GEMINI_API_KEY;

// Remove quotes if present (common issue with .env files)
if (key) {
  key = key.replace(/^["']|["']$/g, '');
}

// Check if API key exists
if (!key) {
  console.error("❌ ERROR: GEMINI_API_KEY is not set in environment variables!");
} else {
  console.log("✅ API Key loaded successfully");
}

// Use v1beta endpoint with correct model name
// gemini-1.5-pro or gemini-1.5-flash are available in v1beta
// gemini-pro is only available in v1 API, not v1beta
// Change 'gemini-1.5-pro' to the current widely supported model alias
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${key}`;
const geminiResponse = async (prompt, userName, assistantName) => {
  // Validate API key before making request
  if (!key) {
    console.error("❌ Cannot make API call: GEMINI_API_KEY is missing!");
    return null;
  }
  
  console.log("📤 Making request to Gemini API...");
  
  try {
    const command = `You are a virtual assistant named ${assistantName} created by ${userName}. You are not google. You will now behave like a voice-enabled assistance.
        Your task is to understand user's natural language input and respond with a JSON object like this: 
        
        {
           "type": "general" | "google_search" | "youtube_search" | "youtube_play" | " get_time" | "get_date" | "get_day" | "get_month"|"calculator_open" | "instagram_open" | "facebook_open" | "weather-show",

            "userInput": "<original user input>" (only remove your name from userinput if exists) and agar kisi ne google ya youtube pe kuch search karne ko bola hai to userInput me only vo search baala text jaye,
            "response": "<a short spoken response to read out loud to the user>"
            
            Instructions:
            - "type": determine the intent of the user.
            - "userinput": original sentence the user spoke.
            - "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Hem what I found", "Today is Tuesday", etc.

            Type meanings:

            - "general": if it's a factual or informational question and if user asks any general question and if you know about it then take this as general category and answer it like telling a joke or any user's question or else say "I don't know". says answers in short, Try to answer by your own as much as you can for user's question
            - "google_search": if user wants to search something on Google
            - "youtube_search": if user wants to search something on YouTube.
            - "youtube_play": if user wants to directly play a video or song.
            - "calculator_open": if user wants to open a calculator
            - "instagram_open": if user wants to open instagram
            - "facebook_open"; if user wants to open facebook.
            - "weather-show": if user wants to know weather
            - "get_time": if user asks for current time.
            - "get_date": if user asks for today's date.
            - "get_day": if user asks what day it is.
            - "get_month": if user asks for the current month.

            Important:

            - Use ${userName} agar koi puche tume kisne banaya,
            - Only respond with the JSON object, nothing else.
            Now your user input - ${prompt}
        }
        
        `
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [
          {

            parts: [
              {
                text: command
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log("✅ Successfully received response from Gemini API");
    console.log("Response data:", JSON.stringify(response.data, null, 2));
    
    // Safely access the response text
    if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
      console.error("Unexpected response structure:", JSON.stringify(response.data, null, 2));
      return null;
    }
    
    const candidate = response.data.candidates[0];
    if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
      console.error("Unexpected candidate structure:", JSON.stringify(candidate, null, 2));
      return null;
    }
    
    return candidate.content.parts[0].text;
  } catch (error) {
    console.error("❌ Error generating response from Gemini:");
    console.error("Error message:", error.message);
    
    if (error.response) {
      // Server responded with error status
      console.error("API Error Status:", error.response.status);
      console.error("API Error Data:", JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 403) {
        console.error("❌ 403 Forbidden - Possible causes:");
        console.error("   1. Invalid API key");
        console.error("   2. API key doesn't have Gemini API enabled");
        console.error("   3. API key quota exceeded");
        console.error("   4. Wrong API endpoint version");
      } else if (error.response.status === 400) {
        console.error("❌ 400 Bad Request - Check request format");
      } else if (error.response.status === 401) {
        console.error("❌ 401 Unauthorized - Invalid API key");
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("❌ No response received from API");
      // Request details not logged to avoid exposing API key in URL
    } else {
      // Error setting up the request
      console.error("❌ Error setting up request:", error.message);
    }
    
    return null;
  }
}
export default geminiResponse;
