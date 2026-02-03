
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const sheet = await prisma.sheet.findFirst({ where: { name: "Patients" } });
    if (!sheet) return;

    const column = await prisma.column.findFirst({
        where: {
            sheetId: sheet.id,
            name: "Product Type"
        }
    });

    if (column) {
        await prisma.column.update({
            where: { id: column.id },
            data: {
                type: "SELECT",
                options: ["CGM PTS", "DME", "Incontinence"] // Example options
            }
        });
        console.log("Updated 'Product Type' to SELECT with 'CGM PTS' option");
    }
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
