
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Clearing data for 'Delivered Date' in 'Patients' sheet...");

    const patientsSheet = await prisma.sheet.findFirst({
        where: { name: "Patients" }
    });

    if (!patientsSheet) {
        console.log("Patients sheet not found");
        return;
    }

    const deliveredDateCol = await prisma.column.findFirst({
        where: { sheetId: patientsSheet.id, name: "Delivered Date" }
    });

    if (!deliveredDateCol) {
        console.log("Delivered Date column not found");
        return;
    }

    const rows = await prisma.row.findMany({
        where: { sheetId: patientsSheet.id }
    });

    let count = 0;
    for (const row of rows) {
        const data = row.data as Record<string, any>;
        if (data[deliveredDateCol.id]) {
            delete data[deliveredDateCol.id]; // Remove the data to make it blank
            await prisma.row.update({
                where: { id: row.id },
                data: { data }
            });
            count++;
        }
    }

    console.log(`Cleared 'Delivered Date' for ${count} rows. Now they are truly blank waiting for automation.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
