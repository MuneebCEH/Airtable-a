
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const sheet = await prisma.sheet.findFirst({ where: { name: "Patients" } });
    if (!sheet) {
        console.error("Patients sheet not found");
        return;
    }

    const newColumns = [
        { name: "Dr Name", type: "TEXT", width: 150 },
        { name: "NPI Number", type: "TEXT", width: 120 },
        { name: "Medicare ID", type: "TEXT", width: 120 }
    ];

    let maxOrder = 0;
    const existingCols = await prisma.column.findMany({ where: { sheetId: sheet.id } });
    if (existingCols.length > 0) {
        maxOrder = Math.max(...existingCols.map(c => c.order));
    }

    for (const col of newColumns) {
        // Check if exists
        const exists = existingCols.find(c => c.name === col.name);
        if (!exists) {
            await prisma.column.create({
                data: {
                    sheetId: sheet.id,
                    name: col.name,
                    type: col.type as any, // casting to specific enum if needed, but string works here usually
                    order: ++maxOrder,
                    width: col.width
                }
            });
            console.log(`Created column: ${col.name}`);
        } else {
            console.log(`Column ${col.name} already exists.`);
        }
    }
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
