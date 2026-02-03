
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const sheet = await prisma.sheet.findFirst({ where: { name: "CGM PTS" } });
    if (!sheet) return;
    const cols = await prisma.column.findMany({ where: { sheetId: sheet.id }, orderBy: { order: 'asc' } });
    fs.writeFileSync('cgm_cols_debug.json', JSON.stringify(cols, null, 2));
    console.log(`Wrote ${cols.length} columns to cgm_cols_debug.json`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
