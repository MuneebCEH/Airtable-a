
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const projects = await prisma.project.findMany({
        include: { sheets: { include: { columns: true } } }
    });

    for (const project of projects) {
        const cgmSheet = project.sheets.find(s => s.name === 'CGM PTS' || s.name === 'CGM PST');
        const existingBrx = project.sheets.find(s => s.name === 'BRX PTs');

        if (existingBrx) {
            console.log(`BRX PTs already exists in project ${project.name}`);
            continue;
        }

        if (!cgmSheet) {
            console.log(`CGM PTS not found in project ${project.name}, skipping`);
            continue;
        }

        console.log(`Creating BRX PTs in project ${project.name}...`);
        const newSheet = await prisma.sheet.create({
            data: {
                projectId: project.id,
                name: 'BRX PTs',
                order: project.sheets.length,
                columns: {
                    create: cgmSheet.columns.map(col => ({
                        name: col.name,
                        type: col.type,
                        order: col.order,
                        width: col.width,
                        options: col.options || undefined,
                    }))
                }
            }
        });
        console.log(`Created BRX PTs sheet with ID: ${newSheet.id}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
