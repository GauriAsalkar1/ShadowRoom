require('dotenv').config();

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ API error:", data.error?.message || "Unknown error");
      return;
    }
    
    console.log("✅ Available models (supports generateContent):\n");
    data.models?.forEach(model => {
      if (model.supportedGenerationMethods?.includes('generateContent')) {
        console.log(` - ${model.name} (display: ${model.displayName})`);
      }
    });
  } catch (err) {
    console.error("❌ Request failed:", err.message);
  }
}

checkModels();