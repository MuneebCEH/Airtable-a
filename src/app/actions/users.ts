"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { hash } from "bcryptjs"
import { Role } from "@prisma/client"

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, users }
    } catch (error) {
        console.error("Failed to fetch users:", error)
        return { success: false, error: "Database error" }
    }
}

export async function createUser(data: { name: string, email: string, password?: string, role: string }) {
    try {
        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email: data.email } })
        if (existing) return { success: false, error: "User already exists" }

        const hashedPassword = await hash(data.password || "password123", 10)

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role as Role
            }
        })

        revalidatePath("/team")
        return { success: true, user }
    } catch (error) {
        console.error("Failed to create user:", error)
        return { success: false, error: "Database error" }
    }
}

export async function updateUserRole(userId: string, role: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: role as Role }
        })
        revalidatePath("/team")
        return { success: true }
    } catch (error) {
        console.error("Failed to update role:", error)
        return { success: false, error: "Database error" }
    }
}

export async function deleteUser(userId: string) {
    try {
        // Prevent deleting the last admin? Or check if it's currently logged in user (frontend check)
        await prisma.user.delete({ where: { id: userId } })
        revalidatePath("/team")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete user:", error)
        return { success: false, error: "Database error" }
    }
}

export async function changePassword(userId: string, newPassword: string) {
    try {
        const hashedPassword = await hash(newPassword, 10)
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })
        return { success: true }
    } catch (error) {
        console.error("Failed to change password:", error)
        return { success: false, error: "Failed to update password" }
    }
}

