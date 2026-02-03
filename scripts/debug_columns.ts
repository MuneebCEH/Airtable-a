
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const sheet = await prisma.sheet.findFirst({ where: { name: "Patients" } });
    if (sheet) {
        console.log(`Patients sheet ID: ${sheet.id}`);
        // List cols
        const cols = await prisma.column.findMany({ where: { sheetId: sheet.id } });
        console.log("Patients Columns:", cols.map(c => `${c.name} (${c.id})`));
    }

    const cgmSheet = await prisma.sheet.findFirst({ where: { name: "CGM PTS" } });
    if (cgmSheet) {
        console.log(`CGM PTS sheet ID: ${cgmSheet.id}`);
        const cols = await prisma.column.findMany({ where: { sheetId: cgmSheet.id } });
        console.log("CGM PTS Columns:", cols.map(c => `${c.name} (${c.id})`));
    }
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
