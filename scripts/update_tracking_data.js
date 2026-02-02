const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const sheetId = 'cmkpqnyiq0007uwn88wcbxepj';
    const trackingColId = 'cmkpqnyly001fuwn8t8xkwezd';
    const statusColId = 'cmkpqnym3001huwn8artgib92';

    // 1. Remove the dropdown logic by changing the column type to TEXT
    console.log("Updating column type to TEXT...");
    await prisma.column.update({
        where: { id: statusColId },
        data: {
            type: 'TEXT',
            options: null
        }
    });

    // 2. Data to update
    const dataToUpdate = [
        { tracking: "887944158110", status: "Delivered" },
        { tracking: "397949048170", status: "We have your package" },
        { tracking: "887902149370", status: "On the way" },
        { tracking: "887680944550", status: "Delivered" },
        { tracking: "887637898502", status: "Label created" },
        { tracking: "887901305520", status: "On the way" }
    ];

    // 3. Get first 6 rows
    const rows = await prisma.row.findMany({
        where: { sheetId: sheetId },
        orderBy: { order: 'asc' },
        take: 6
    });

    console.log(`Found ${rows.length} rows to update.`);

    for (let i = 0; i < rows.length; i++) {
        if (i >= dataToUpdate.length) break;

        const row = rows[i];
        const currentData = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;

        const newData = {
            ...currentData,
            [trackingColId]: dataToUpdate[i].tracking,
            [statusColId]: dataToUpdate[i].status
        };

        await prisma.row.update({
            where: { id: row.id },
            data: {
                data: newData
            }
        });
        console.log(`Updated row ${row.id} with tracking ${dataToUpdate[i].tracking}`);
    }

    console.log("All updates completed.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
