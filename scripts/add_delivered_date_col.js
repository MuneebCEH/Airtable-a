
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addDeliveredDateCol() {
    try {
        const sheets = await prisma.sheet.findMany({
            where: {
                OR: [
                    { name: 'CGM PTS' },
                    { name: 'CGM PST' }
                ]
            }
        });

        for (const sheet of sheets) {
            const columns = await prisma.column.findMany({
                where: { sheetId: sheet.id },
                orderBy: { order: 'asc' }
            });

            console.log(`Checking sheet: "${sheet.name}" (ID: ${sheet.id}) with ${columns.length} columns`);

            const deliveryStatusCol = columns.find(c => c.name.toLowerCase().trim() === 'delivery status');

            if (deliveryStatusCol) {
                console.log(`  Found "Delivery Status" at order ${deliveryStatusCol.order}`);

                const exists = columns.find(c => c.name.toLowerCase().trim() === 'delivered date');
                if (exists) {
                    console.log(`  "Delivered Date" already exists in ${sheet.id}. Skipping.`);
                    continue;
                }

                console.log(`  Adding "Delivered Date" after it.`);
                const targetOrder = deliveryStatusCol.order + 1;

                await prisma.column.updateMany({
                    where: { sheetId: sheet.id, order: { gte: targetOrder } },
                    data: { order: { increment: 1 } }
                });

                await prisma.column.create({
                    data: {
                        sheetId: sheet.id,
                        name: 'Delivered Date',
                        type: 'DATE',
                        order: targetOrder,
                        width: 150
                    }
                });
                console.log(`  Successfully added to ${sheet.id}`);
            } else {
                console.log(`  "Delivery Status" NOT FOUND in this sheet.`);
                // Log first few columns to see what's there
                console.log(`  Sample columns: ${columns.slice(0, 5).map(c => c.name).join(', ')}`);
            }
        }
    } catch (err) {
        console.error("ERROR:", err);
    } finally {
        await prisma.$disconnect();
    }
}
addDeliveredDateCol();
