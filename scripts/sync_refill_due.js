
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncRefillDue() {
    try {
        const sheet = await prisma.sheet.findFirst({
            where: {
                OR: [
                    { name: 'CGM PTS' },
                    { name: 'CGM PST' }
                ]
            }
        });

        if (!sheet) {
            console.log("CGM Sheet not found");
            return;
        }

        const columns = await prisma.column.findMany({ where: { sheetId: sheet.id } });
        const deliveredDateCol = columns.find(c => c.name.toLowerCase() === 'delivered date');
        const refillDueCol = columns.find(c => c.name.toLowerCase() === 'refill due');

        if (!deliveredDateCol || !refillDueCol) {
            console.log(`Columns not found: Delivered Date=${!!deliveredDateCol}, Refill Due=${!!refillDueCol}`);
            return;
        }

        const rows = await prisma.row.findMany({ where: { sheetId: sheet.id } });
        console.log(`Processing ${rows.length} rows in ${sheet.name}`);

        let count = 0;
        for (const row of rows) {
            const data = row.data || {};
            const deliveredDate = data[deliveredDateCol.id];

            if (deliveredDate) {
                const newData = {
                    ...data,
                    [refillDueCol.id]: deliveredDate
                };

                await prisma.row.update({
                    where: { id: row.id },
                    data: { data: newData }
                });
                count++;
            }
        }

        console.log(`Successfully synced ${count} rows`);

    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

syncRefillDue();
