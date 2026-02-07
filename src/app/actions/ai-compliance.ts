"use server"

import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFile } from "fs/promises";
import { join } from "path";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const COMPLIANCE_PROMPT = `You are a DME Compliance & Chart Review Engine. 
Analyze the provided medical document (PDF or Image). 

Rules:
1. REVIEW Criteria:
   - PASS if the document contains a Patient Name, Date of Service, and Doctor Name/Signature.
   - FAIL only if the document is illegible or completely missing critical patient identifiers.
   
2. Start your response with: 👉 PASS or 👉 FAIL
3. Provide a brief reasoning.
4. Finally, ALWAYS extract the following data in JSON format at the very end:

JSON_START
{
  "dr_name": "extracted name",
  "dr_npi": "extracted npi",
  "dob": "YYYY-MM-DD",
  "patient_name": "extracted name",
  "medicare_id": "extracted id",
  "date_of_appointment": "YYYY-MM-DD"
}
JSON_END

If a field is missing, use null.
`;

export async function processAttachmentCompliance(filePath: string) {
    if (!process.env.GEMINI_API_KEY) {
        return { success: false, error: "Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file." };
    }

    const absolutePath = filePath.startsWith("/")
        ? join(process.cwd(), "public", filePath)
        : join(process.cwd(), "public", "uploads", filePath);

    try {
        const fileContent = await readFile(absolutePath);
        const isPdf = filePath.toLowerCase().endsWith(".pdf");
        const isImage = /\.(jpg|jpeg|png|webp)$/i.test(filePath);

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }); // Reverting to original working model



        const mimeType = isPdf ? "application/pdf" : "image/jpeg";

        const result = await model.generateContent([
            COMPLIANCE_PROMPT,
            {
                inlineData: {
                    data: fileContent.toString("base64"),
                    mimeType
                }
            }
        ]);

        const aiResponse = result.response.text();

        if (!aiResponse) return { success: false, error: "AI failed to respond. Check if the PDF is too large." };



        // Extract JSON data
        let extractedData = null;
        try {
            const jsonPart = aiResponse.split("JSON_START")[1]?.split("JSON_END")[0];
            if (jsonPart) {
                extractedData = JSON.parse(jsonPart.trim());
            }
        } catch (e) {
            console.error("JSON parse failed", e);
        }

        const displayResponse = aiResponse.split("JSON_START")[0].trim();

        return {
            success: true,
            analysis: displayResponse,
            extractedData
        };

    } catch (error: any) {
        console.error("Gemini Error:", error);
        return { success: false, error: `Gemini processing failed: ${error.message || "Unknown error"}. Check API key or file limits.` };
    }
}
