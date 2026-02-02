const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        console.log("Project not found");
        return;
    }

    console.log(JSON.stringify(project, null, 2));
}

main();
