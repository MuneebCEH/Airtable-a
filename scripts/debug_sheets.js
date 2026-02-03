
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const prisma = new PrismaClient()

async function main() {
    const sheets = await prisma.sheet.findMany({
        include: { columns: true }
    })
    fs.writeFileSync('sheets_debug.json', JSON.stringify(sheets.map(s => ({
        id: s.id,
        name: s.name,
        cols: s.columns.map(c => ({ id: c.id, name: c.name }))
    })), null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
