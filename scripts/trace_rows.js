const { PrismaClient } = require('@prisma/client');
async function d() {
    const p = new PrismaClient({ datasources: { db: { url: 'file:C:/Users/FBC/Downloads/airtable/prisma/dev.db' } } });
    const rows = await p.row.findMany({ include: { sheet: { include: { project: true } } }, take: 20 });
    const projects = {};
    for (const r of rows) {
        const pname = r.sheet.project.name;
        const pid = r.sheet.project.id;
        projects[pid] = (projects[pid] || 0) + 1;
        console.log(`Row ${r.id} belongs to Project: ${pname} (${pid})`);
    }
    await p.$disconnect();
}
d();
