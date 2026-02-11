const { PrismaClient } = require('@prisma/client');
async function d() {
    const p = new PrismaClient({
        datasources: {
            db: { url: 'file:C:/Users/FBC/Downloads/airtable/prisma/dev.db' }
        }
    });
    try {
        const projects = await p.project.findMany({
            include: { _count: { select: { sheets: true } } }
        });
        for (const proj of projects) {
            const rowCountRes = await p.row.count({
                where: { sheet: { projectId: proj.id } }
            });
            console.log(`Project: ${proj.name} (ID: ${proj.id}) - Sheets: ${proj._count.sheets}, Rows: ${rowCountRes}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await p.$disconnect();
    }
}
d();
