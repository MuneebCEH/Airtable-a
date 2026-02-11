const { PrismaClient } = require('@prisma/client');
async function d() {
    const p = new PrismaClient({ datasources: { db: { url: 'file:C:/Users/FBC/Downloads/airtable/prisma/dev.db' } } });
    const pid = 'cmkpqnyil0005uwn8xbqpgtue';
    const sheetNames = ['CGM PTS', 'BRX PTs'];
    for (const name of sheetNames) {
        const s = await p.sheet.findFirst({ where: { projectId: pid, name }, include: { columns: true, rows: true } });
        if (s) {
            const refillCol = s.columns.find(c => c.name.toLowerCase().includes('refill'));
            if (refillCol) {
                const hasData = s.rows.filter(r => !!r.data[refillCol.id]).length;
                console.log(`Sheet: ${name} | Rows with Refill Due data: ${hasData}/${s.rows.length}`);
            } else {
                console.log(`Sheet: ${name} | NO REFILL COLUMN FOUND`);
            }
        }
    }
    await p.$disconnect();
}
d();
