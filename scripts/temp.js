
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
    const cols = await prisma.column.findMany({ where: { sheetId: 'cmkpqnyj1000buwn8dsj7498l' }, orderBy: { order: 'asc' } });
    console.log(cols.map(c => `[${c.name}] (${c.id})`).join('\n'));
    await prisma.$disconnect();
}
run();
