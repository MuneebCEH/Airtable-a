const { PrismaClient } = require('@prisma/client');
async function d() {
    const p = new PrismaClient({ datasources: { db: { url: 'file:C:/Users/FBC/Downloads/airtable/prisma/dev.db' } } });
    const proj = await p.project.findUnique({ where: { id: 'cmkpqnyil0005uwn8xbqpgtue' } });
    console.log('Project Name with Rows:', proj.name);
    await p.$disconnect();
}
d();
