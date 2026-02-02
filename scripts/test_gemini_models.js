
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Testing gemini-1.5-flash...");
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash:", result.response.text());
    } catch (e) {
        console.log("gemini-1.5-flash failed:", e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Testing gemini-pro...");
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-pro:", result.response.text());
    } catch (e) {
        console.log("gemini-pro failed:", e.message);
    }
}

listModels();
