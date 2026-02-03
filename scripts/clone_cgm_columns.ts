
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const patientsSheet = await prisma.sheet.findFirst({ where: { name: "Patients" } });
    const cgmSheet = await prisma.sheet.findFirst({ where: { name: "CGM PTS" } });

    if (!patientsSheet || !cgmSheet) {
        console.error("Sheets not found");
        return;
    }

    const sourceColumns = await prisma.column.findMany({ where: { sheetId: patientsSheet.id } });
    const targetColumns = await prisma.column.findMany({ where: { sheetId: cgmSheet.id } });

    console.log(`Syncing columns from Patients (${sourceColumns.length}) to CGM PTS (${targetColumns.length})...`);

    for (const sourceCol of sourceColumns) {
        const exists = targetColumns.find(c => c.name.toLowerCase() === sourceCol.name.toLowerCase());
        if (!exists) {
            await prisma.column.create({
                data: {
                    sheetId: cgmSheet.id,
                    name: sourceCol.name,
                    type: sourceCol.type,
                    order: sourceCol.order,
                    width: sourceCol.width,
                    options: sourceCol.options || undefined
                }
            });
            console.log(`Created column: ${sourceCol.name}`);
        }
    }
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
