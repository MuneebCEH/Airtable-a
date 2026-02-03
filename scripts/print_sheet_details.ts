
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const sheets = await prisma.sheet.findMany({
        where: { name: { in: ["Patients", "CGM PTS", "CGM PST"] } },
        include: { columns: true }
    });

    for (const sheet of sheets) {
        console.log(`\nSheet: ${sheet.name} (ID: ${sheet.id})`);
        console.log("Columns:");
        sheet.columns.forEach(c => {
            console.log(`  - ${c.name} (ID: ${c.id}, Type: ${c.type})`);
        });
    }
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
