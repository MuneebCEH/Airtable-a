
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Reordering 'Item' column next to 'Patient Name'...");

    // 1. Find columns for "Patients" sheet (or just correct sheet by context if unique enough)
    // We'll search for the sheet named "Patients"
    const sheet = await prisma.sheet.findFirst({
        where: { name: "Patients" }
    });

    if (!sheet) {
        console.error("Patients sheet not found");
        return;
    }

    const columns = await prisma.column.findMany({
        where: { sheetId: sheet.id },
        orderBy: { order: 'asc' }
    });

    const patientNameCol = columns.find(c => c.name === "Patient Name");
    const itemCol = columns.find(c => c.name === "Item");

    if (!patientNameCol || !itemCol) {
        console.error("Could not find 'Patient Name' or 'Item' column.");
        return;
    }

    console.log(`Current Order - Patient Name: ${patientNameCol.order}, Item: ${itemCol.order}`);

    // Target order is right after Patient Name
    const targetOrder = patientNameCol.order + 1;

    // If it's already there, do nothing
    if (itemCol.order === targetOrder) {
        console.log("Item is already next to Patient Name.");
        return;
    }

    // We need to shift everything between targetOrder and current itemCol.order
    // Or simpler: just re-assign orders for the whole list

    // Create a new ordered list
    const newOrderList = columns.filter(c => c.id !== itemCol.id);
    // Insert itemCol at the correct new position
    // Since patientNameCol is in newOrderList, we find its index there
    const patientNameIndex = newOrderList.findIndex(c => c.id === patientNameCol.id);

    // Insert Item right after Patient Name
    newOrderList.splice(patientNameIndex + 1, 0, itemCol);

    // Now update all columns with their new index
    console.log("Updating column orders...");

    for (let i = 0; i < newOrderList.length; i++) {
        const col = newOrderList[i];
        if (col.order !== i) {
            await prisma.column.update({
                where: { id: col.id },
                data: { order: i }
            });
            // console.log(`Updated ${col.name} to order ${i}`);
        }
    }

    console.log("Reordering complete. 'Item' is now next to 'Patient Name'.");
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
