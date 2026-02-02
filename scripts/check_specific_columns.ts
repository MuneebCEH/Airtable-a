
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const sheet = await prisma.sheet.findFirst({ where: { name: "Patients" } });
    if (!sheet) return;

    const namesToCheck = ["Dr Name", "NPI Number", "Medicare ID"];
    const columns = await prisma.column.findMany({
        where: { sheetId: sheet.id, name: { in: namesToCheck } }
    });

    console.log("Found columns:", columns.map(c => c.name));
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
