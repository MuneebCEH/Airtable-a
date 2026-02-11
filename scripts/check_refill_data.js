const { PrismaClient } = require('@prisma/client');
async function d() {
    const p = new PrismaClient({ datasources: { db: { url: 'file:C:/Users/FBC/Downloads/airtable/prisma/dev.db' } } });
    const pid = 'cmkpqnyil0005uwn8xbqpgtue'; // The data project
    const sheetName = 'Patients';
    const sheet = await p.sheet.findFirst({ where: { projectId: pid, name: sheetName }, include: { columns: true, rows: true } });

    if (!sheet) return console.log('Sheet not found');

    const refillCol = sheet.columns.find(c => c.name.toLowerCase().includes('refill'));
    if (!refillCol) return console.log('Refill column not found');

    console.log(`Checking ${sheet.rows.length} rows in ${sheetName} for Refill Due dates...`);
    let count = 0;
    for (const r of sheet.rows) {
        if (r.data[refillCol.id]) {
            count++;
            if (count < 5) console.log(`  Row ${r.id}: ${r.data[refillCol.id]}`);
        }
    }
    console.log(`Total rows with Refill Due: ${count}`);
    await p.$disconnect();
}
d();
