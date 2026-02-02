const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Updating 'Item' column to SELECT type with 'CGM PTS' option...");

    const updated = await prisma.column.updateMany({
        where: {
            name: "Item",
            sheet: {
                name: "Patients"
            }
        },
        data: {
            type: "SELECT",
            options: ["CGM PTS"]
        }
    });

    console.log(`Updated ${updated.count} columns.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
