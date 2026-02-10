const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'file:./dev.db'
        }
    }
});

async function check() {
    try {
        const projects = await prisma.project.count();
        const sheets = await prisma.sheet.count();
        const rows = await prisma.row.count();
        console.log(`Projects: ${projects}`);
        console.log(`Sheets: ${sheets}`);
        console.log(`Rows: ${rows}`);

        if (projects > 0) {
            const firstProject = await prisma.project.findFirst({ include: { sheets: true } });
            console.log('First Project:', firstProject.name);
            console.log('Sheets in first project:', firstProject.sheets.map(s => s.name));
        }
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

check();
