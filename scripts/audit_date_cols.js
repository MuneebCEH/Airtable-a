const { PrismaClient } = require('@prisma/client');
async function d() {
    const p = new PrismaClient({ datasources: { db: { url: 'file:C:/Users/FBC/Downloads/airtable/prisma/dev.db' } } });
    const pid = 'cmkpqnyil0005uwn8xbqpgtue';
    const sheets = await p.sheet.findMany({ where: { projectId: pid }, include: { columns: true } });
    let output = "";
    sheets.forEach(s => {
        const rc = s.columns.find(c => c.name.toLowerCase().includes('refill'))?.name || 'NONE';
        const dc = s.columns.find(c => c.name.toLowerCase().includes('delivered date'))?.name || 'NONE';
        output += `${s.name} | Refill: ${rc} | Delivered: ${dc}\n`;
    });
    console.log(output);
    await p.$disconnect();
}
d();
