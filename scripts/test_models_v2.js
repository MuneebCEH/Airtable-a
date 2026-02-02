
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function test() {
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.5-pro", "gemini-pro", "gemini-pro-vision"];

    for (const m of modelsToTry) {
        console.log(`\nTesting ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            // Simple text test
            const result = await model.generateContent("Hi");
            console.log(`✅ SUCCESS: ${m}`);
        } catch (e) {
            console.log(`❌ FAIL: ${m} - ${e.message.split('\n')[0]}`);
        }
    }
}

test();
