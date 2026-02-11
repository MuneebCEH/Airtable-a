const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function extract() {
    const prisma = new PrismaClient();
    const projectId = 'cmlbjpkg00005uw4sdq56abj3';

    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                sheets: {
                    include: {
                        columns: true
                    }
                }
            }
        });

        if (!project) {
            console.error('Project not found locally.');
            return;
        }

        fs.writeFileSync('project_structure.json', JSON.stringify(project, null, 2));
        console.log('Structure saved to project_structure.json');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
extract();
