
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const sheet = await prisma.sheet.findFirst({ where: { name: "Patients" } });
    if (!sheet) {
        console.error("Patients sheet not found");
        return;
    }

    const column = await prisma.column.findFirst({
        where: {
            sheetId: sheet.id,
            name: "Item"
        }
    });

    if (column) {
        await prisma.column.update({
            where: { id: column.id },
            data: { name: "Product Type" }
        });
        console.log("Renamed 'Item' to 'Product Type'");
    } else {
        console.log("'Item' column not found (maybe already renamed?)");
    }
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
