
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const sheet = await prisma.sheet.findFirst({ where: { name: "CGM PTS" } });
    if (!sheet) return;

    // Based on the debug log, cml... columns are the ones added by the assistant
    const deleted = await prisma.column.deleteMany({
        where: {
            sheetId: sheet.id,
            id: { startsWith: 'cml' }
        }
    });

    console.log(`Deleted ${deleted.count} newly created columns from CGM PTS.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
