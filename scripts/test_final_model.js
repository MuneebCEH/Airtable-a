
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function testSelected() {
    const modelName = "gemini-2.0-flash";
    console.log(`Testing ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello found model");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.log("Failed:", e.message);
    }
}

testSelected();
