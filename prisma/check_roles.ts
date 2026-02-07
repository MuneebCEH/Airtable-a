import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    console.log('Users:', users.map(u => ({ email: u.email, role: u.role })))
    const members = await prisma.workspaceMember.findMany()
    console.log('Members:', members.map(m => ({ userId: m.userId, role: m.role })))
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
