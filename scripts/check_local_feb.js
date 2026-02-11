const { PrismaClient } = require('@prisma/client');
async function d() {
    const p = new PrismaClient({ datasources: { db: { url: 'file:C:/Users/FBC/Downloads/airtable/prisma/dev.db' } } });
    const pid = 'cmkpqnyil0005uwn8xbqpgtue';
    const sheets = await p.sheet.findMany({ where: { projectId: pid }, include: { columns: true, rows: true } });

    console.log('--- SEARCHING FOR FEB 2026 DATES IN LOCAL DB ---');
    for (const s of sheets) {
        const dcs = s.columns.filter(c => ['refill due', 'delivered date'].includes(c.name.toLowerCase()));
        for (const dc of dcs) {
            for (const r of s.rows) {
                const val = r.data[dc.id];
                if (val && val.includes('02/') && val.includes('2026')) {
                    console.log(`Found: ${s.name} | ${dc.name} | ${val}`);
                }
            }
        }
    }
    await p.$disconnect();
}
d();
