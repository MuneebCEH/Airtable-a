"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function uploadFile(formData: FormData) {
    const file = formData.get("file") as File
    if (!file) {
        throw new Error("No file uploaded")
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save to public/uploads
    const uploadDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })
    const path = join(uploadDir, file.name)

    try {
        await writeFile(path, buffer)
        return { success: true, path: `/uploads/${file.name}` }
    } catch (error) {
        console.error("Upload failed", error)
        return { success: false }
    }
}
