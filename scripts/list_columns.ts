
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const sheet = await prisma.sheet.findFirst({
        where: { name: "Patients" },
        include: { columns: { orderBy: { order: 'asc' } } }
    });

    if (!sheet) {
        console.log("Patients sheet not found");
        return;
    }

    console.log("Columns in Patients sheet:");
    sheet.columns.forEach(c => {
        console.log(`- [${c.id}] ${c.name} (${c.type})`);
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
