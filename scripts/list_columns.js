const { PrismaClient } = require('@prisma/client');
async function d() {
    const p = new PrismaClient({ datasources: { db: { url: 'file:C:/Users/FBC/Downloads/airtable/prisma/dev.db' } } });
    const s = await p.sheet.findFirst({
        where: { projectId: 'cmkpqnyil0005uwn8xbqpgtue', name: 'Patients' },
        include: { columns: true }
    });
    if (s) console.log(s.columns.map(c => c.name));
    else console.log('Sheet not found');
    await p.$disconnect();
}
d();
