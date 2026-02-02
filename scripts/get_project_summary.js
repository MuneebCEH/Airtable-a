const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
    const projectId = 'cmkpqnyil0005uwn8xbqpgtue';
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            sheets: {
                include: {
                    columns: true,
                    rows: true
                }
            }
        }
    });

    if (!project) {
        fs.writeFileSync('output.txt', 'Project not found');
        return;
    }

    let summary = `Project: ${project.name}\n`;
    project.sheets.forEach(sheet => {
        summary += `\nSheet: ${sheet.name} (ID: ${sheet.id})\n`;
        summary += `Columns:\n`;
        sheet.columns.forEach(col => {
            summary += `  - ${col.name} (ID: ${col.id}, Type: ${col.type})\n`;
        });
        summary += `Rows: ${sheet.rows.length}\n`;
        if (sheet.rows.length > 0) {
            summary += `First row data: ${JSON.stringify(sheet.rows[0].data)}\n`;
        }
    });

    fs.writeFileSync('output.txt', summary);
}

main().catch(err => fs.writeFileSync('output.txt', err.stack));
