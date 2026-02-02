const { updateRowData } = require('../src/app/actions/rows');

async function testRealTime() {
    const rowId = 'cmkpqnyqj002tuwn8imqbrgxb'; // One of the existing rows
    const sheetId = 'cmkpqnyiq0007uwn88wcbxepj';
    const trackingColId = 'cmkpqnyly001fuwn8t8xkwezd';
    const statusColId = 'cmkpqnym3001huwn8artgib92';

    console.log("Testing real-time update for row:", rowId);

    // Simulate updating tracking number
    const result = await updateRowData(rowId, { [trackingColId]: "887944158110" }, sheetId);

    if (result.success) {
        console.log("Update success!");
        console.log("Updated data:", JSON.stringify(result.row.data, null, 2));
        if (result.row.data[statusColId] === "Delivered") {
            console.log("VERIFIED: Tracking status was automatically updated to 'Delivered'");
        } else {
            console.log("FAILED: Status not updated correctly. Found:", result.row.data[statusColId]);
        }
    } else {
        console.error("Update failed:", result.error);
    }
}

// Since updateRowData is a server action, it might use 'use server' and imports that don't work in plain node.
// I'll use a direct prisma check instead if node fails.
testRealTime();
