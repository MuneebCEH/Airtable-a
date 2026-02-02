
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Checking models for key ending in...", apiKey ? apiKey.slice(-4) : "NONE");

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`HTTP Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.log("Response:", text);
            return;
        }

        const data = await response.json();
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.log("No models returned in list:", data);
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

listModels();
