const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Starting DB update for 'Item' column...");

    // Find all sheets named "Patients"
    const sheets = await prisma.sheet.findMany({
        where: { name: "Patients" },
        include: { columns: true }
    });

    for (const sheet of sheets) {
        console.log(`Processing sheet: ${sheet.name} (ID: ${sheet.id})`);

        // Check if "Item" column already exists
        const existingItem = sheet.columns.find(c => c.name === "Item");
        if (existingItem) {
            console.log("  'Item' column already exists. Skipping.");
            continue;
        }

        // Find "Patient ID" column to determine position
        const patientIdCol = sheet.columns.find(c => c.name === "Patient ID");
        if (!patientIdCol) {
            console.log("  'Patient ID' column not found. Adding 'Item' at end.");
            await prisma.column.create({
                data: {
                    sheetId: sheet.id,
                    name: "Item",
                    type: "TEXT",
                    order: sheet.columns.length,
                    width: 150
                }
            });
            continue;
        }

        const insertIndex = patientIdCol.order + 1;

        // Shift all columns after insertIndex
        await prisma.column.updateMany({
            where: {
                sheetId: sheet.id,
                order: { gte: insertIndex }
            },
            data: {
                order: { increment: 1 }
            }
        });

        // Create the "Item" column
        await prisma.column.create({
            data: {
                sheetId: sheet.id,
                name: "Item",
                type: "TEXT",
                order: insertIndex,
                width: 150
            }
        });

        console.log(`  Added 'Item' column at order ${insertIndex}`);
    }

    console.log("DB update complete.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
