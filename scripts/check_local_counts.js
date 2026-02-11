const { PrismaClient } = require('@prisma/client');
async function d() {
    const p = new PrismaClient({ datasources: { db: { url: 'file:C:/Users/FBC/Downloads/airtable/prisma/dev.db' } } });
    const pid = 'cmkpqnyil0005uwn8xbqpgtue';
    const sheets = await p.sheet.findMany({
        where: { projectId: pid },
        include: { _count: { select: { rows: true } } }
    });
    sheets.forEach(s => console.log(`${s.name}: ${s._count.rows} rows (ID: ${s.id})`));
    await p.$disconnect();
}
d();
