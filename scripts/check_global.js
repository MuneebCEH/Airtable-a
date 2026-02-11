const { PrismaClient } = require('@prisma/client');
const path = require('path');

async function d() {
    const dbPath = path.resolve(__dirname, '../prisma/dev.db');
    console.log('Absolute DB Path:', dbPath);
    const p = new PrismaClient({ datasources: { db: { url: `file:${dbPath}` } } });
    try {
        const count = await p.row.count();
        console.log('Global Row Count:', count);
    } catch (e) {
        console.error(e);
    } finally {
        await p.$disconnect();
    }
}
d();
