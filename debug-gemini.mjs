import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config();

// Manual fallback if dotenv fails (sometimes weird with paths)
let key = process.env.GEMINI_API_KEY;
if (!key && fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf-8');
    const match = envContent.match(/GEMINI_API_KEY=(.+)/);
    if (match) key = match[1].trim();
}

console.log("API Key Status:", key ? "Found (" + key.substring(0, 5) + "...)" : "MISSING");

async function test() {
    if (!key) return;

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        console.log("1. Testing Basic Text Generation...");
        const result = await model.generateContent("Hello?");
        console.log("   Success:", result.response.text());
    } catch (e) {
        console.error("   FAILED (Text):", e.message);
        if (e.message.includes("API key not valid")) {
            console.error("   CRITICAL: The API key is invalid.");
            return;
        }
    }

    try {
        console.log("\n2. Testing PDF Processing...");
        // Look for the file
        const possiblePaths = ['new pdfd.PDF', 'public/uploads/new pdfd.PDF'];
        let filePath = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                filePath = p;
                break;
            }
        }

        if (!filePath) {
            console.error("   File 'new pdfd.PDF' not found to test.");
            const allFiles = fs.readdirSync('public/uploads');
            console.log("   Available files in public/uploads:", allFiles);
            return;
        }

        console.log(`   Found file: ${filePath}`);
        const fileContent = fs.readFileSync(filePath);
        console.log(`   Size: ${fileContent.length} bytes`);

        const result = await model.generateContent([
            "What is in this document?",
            {
                inlineData: {
                    data: fileContent.toString("base64"),
                    mimeType: "application/pdf"
                }
            }
        ]);
        console.log("   Success:", result.response.text().substring(0, 100) + "...");

    } catch (e) {
        console.error("   FAILED (PDF):", e);
        console.error("   Message:", e.message);
        // Common Gemini errors:
        // 400 User location is not supported
        // 400 API key not valid
        // 500 Internal error
    }
}

test();
