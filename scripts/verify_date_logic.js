const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mock FedEx lookup for test
async function getFedexStats(num) {
    if (num === "887944158110") return { status: "Delivered", deliveredDate: "2026-01-22T15:30:59-07:00" };
    return { status: "Pending", deliveredDate: null };
}

async function main() {
    const rowId = 'cmkpqnyqj002tuwn8imqbrgxb';
    const sheetId = 'cmkpqnyiq0007uwn88wcbxepj';
    const trackingColId = 'cmkpqnyly001fuwn8t8xkwezd';
    const statusColId = 'cmkpqnym3001huwn8artgib92';
    const dateColId = 'cmkpqnym9001juwn8bsdub03h';

    console.log("Simulating real-time logic for delivery date...");

    const columns = await prisma.column.findMany({ where: { sheetId: sheetId } });
    const trackingCol = columns.find(c => c.name.toLowerCase() === 'tracking');
    const statusCol = columns.find(c => c.name.toLowerCase() === 'tracking status');
    const dateCol = columns.find(c => c.name.toLowerCase() === 'delivered date');

    const incomingData = { [trackingColId]: "887944158110" };

    if (trackingCol && incomingData[trackingCol.id]) {
        const stats = await getFedexStats(incomingData[trackingCol.id]);
        if (stats.status && statusCol) {
            incomingData[statusCol.id] = stats.status;
        }
        if (stats.deliveredDate && dateCol) {
            incomingData[dateCol.id] = stats.deliveredDate.split('T')[0];
            console.log(`Auto-added date: ${incomingData[dateCol.id]} for column: ${dateCol.id}`);
        }
    }

    const existingRow = await prisma.row.findUnique({ where: { id: rowId } });
    const currentData = typeof existingRow.data === 'string' ? JSON.parse(existingRow.data) : existingRow.data;
    const newData = { ...currentData, ...incomingData };

    await prisma.row.update({
        where: { id: rowId },
        data: { data: newData }
    });

    console.log("Database updated successfully with delivery date logic.");
}

main().finally(() => prisma.$disconnect());
