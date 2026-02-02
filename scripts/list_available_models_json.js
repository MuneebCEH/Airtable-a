
const fs = require('fs');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const output = JSON.stringify(data, null, 2);
        fs.writeFileSync('models_clean.json', output);
        console.log("Written to models_clean.json");
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}
listModels();
