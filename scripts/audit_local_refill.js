const { PrismaClient } = require('@prisma/client');
async function d() {
    const p = new PrismaClient({ datasources: { db: { url: 'file:C:/Users/FBC/Downloads/airtable/prisma/dev.db' } } });
    const pid = 'cmkpqnyil0005uwn8xbqpgtue';
    const sheets = await p.sheet.findMany({ where: { projectId: pid }, include: { columns: true } });

    for (const s of sheets) {
        const matches = s.columns.filter(c => c.name.toLowerCase().includes('refill'));
        if (matches.length > 0) {
            console.log(`Sheet: ${s.name} | Matches: ${matches.map(m => m.name).join(', ')}`);
        }
    }
    await p.$disconnect();
}
d();
