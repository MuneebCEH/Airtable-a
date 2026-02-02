
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function genericTest() {
    console.log("Using API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");

    // List of candidates to try
    const candidates = [
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    for (const modelName of candidates) {
        console.log(`\n--- Attempting Model: ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test.");
            console.log(`✅ SUCCESS: ${modelName} responded: ${result.response.text()}`);

            // If success, we found a winner. Stop.
            return;
        } catch (e) {
            console.log(`❌ FAILED: ${modelName}`);
            // console.log("Error details:", e.message);
            if (e.message.includes("404")) {
                console.log("   -> Model not found or not supported.");
            } else {
                console.log("   -> " + e.message);
            }
        }
    }
    console.log("\nAll models failed.");
}

genericTest();
