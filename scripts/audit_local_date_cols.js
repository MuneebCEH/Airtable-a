const { PrismaClient } = require('@prisma/client');
async function d() {
    const p = new PrismaClient({ datasources: { db: { url: 'file:C:/Users/FBC/Downloads/airtable/prisma/dev.db' } } });
    const s = await p.sheet.findFirst({
        where: { projectId: 'cmkpqnyil0005uwn8xbqpgtue', name: 'Patients' },
        include: { columns: true }
    });
    if (s) {
        console.log('Date columns in Patients:');
        s.columns.filter(c => c.type === 'DATE').forEach(c => console.log(` - ${c.name}`));
    }
    await p.$disconnect();
}
d();
