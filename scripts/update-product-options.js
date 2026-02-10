
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const col = await prisma.column.findFirst({
        where: {
            sheet: { name: 'Patients' },
            name: { in: ['Product Type', 'Product', 'Item'] }
        }
    });

    if (!col) {
        console.error('Column not found');
        return;
    }

    console.log('Found column:', JSON.stringify(col, null, 2));

    let currentOptions = col.options || [];
    if (!currentOptions.includes('BRX PTs')) {
        const newOptions = [...currentOptions, 'BRX PTs'];
        const updated = await prisma.column.update({
            where: { id: col.id },
            data: { options: newOptions }
        });
        console.log('Updated options:', JSON.stringify(updated.options));
    } else {
        console.log('BRX PTs already in options');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
