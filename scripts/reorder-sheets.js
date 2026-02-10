
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const projects = await prisma.project.findMany({
        include: { sheets: { orderBy: { order: 'asc' } } }
    });

    for (const project of projects) {
        console.log(`Processing project: ${project.name}`);
        const sheets = project.sheets;

        const cgmIndex = sheets.findIndex(s => s.name === 'CGM PTS' || s.name === 'CGM PST');
        const brxIndex = sheets.findIndex(s => s.name === 'BRX PTs');

        if (brxIndex === -1) {
            console.log("BRX PTs sheet not found in this project.");
            continue;
        }

        if (cgmIndex === -1) {
            console.log("CGM PTS sheet not found, moving BRX to last available slot.");
            // Optional logic if you want it somewhere specific when CGM is missing
            continue;
        }

        // We want BRX to be right after CGM.
        // The target order for BRX is cgm's order + 0.5 (or similar logic to re-order everything)

        console.log(`Moving BRX PTs (current order: ${sheets[brxIndex].order}) after CGM PTS (order: ${sheets[cgmIndex].order})`);

        // Simple re-ordering:
        // 1. Remove BRX from array
        const [brxSheet] = sheets.splice(brxIndex, 1);

        // 2. Find new index of CGM (might have shifted)
        const newCgmIndex = sheets.findIndex(s => s.name === 'CGM PTS' || s.name === 'CGM PST');

        // 3. Insert BRX after CGM
        sheets.splice(newCgmIndex + 1, 0, brxSheet);

        // 4. Update all orders in database
        for (let i = 0; i < sheets.length; i++) {
            await prisma.sheet.update({
                where: { id: sheets[i].id },
                data: { order: i }
            });
        }
        console.log(`Re-ordered sheets for project ${project.name}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
