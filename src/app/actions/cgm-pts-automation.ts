import { prisma } from "@/lib/prisma"

const mapping: Record<string, string[]> = {
    "Name": ["Patient Name", "Name"],
    "Date in Dropbox": ["DOS", "Date in Dropbox"],
    "Completed": ["Complete", "Completed"],
    "Voice Record": ["Has Voice Record", "Voice Record"],
    "Clinical Notes": ["Clinical Notes"],
    "RX": ["RX"],
    "No Match": ["Same/Similar", "No Match"],
    "Packing Slip": ["Packing Slip"],
    "POD": ["POD"],
    "notes": ["Notes", "notes"],
    "Tracking Number": ["Tracking", "Tracking Number"],
    "Delivery Status": ["Tracking Status", "Delivery Status"],
    "Attachments": ["Attachments"],
    "Returned": ["Returned"],
    "Medicare ID": ["Patient ID", "Medicare ID"],
    "DOB": ["DOB"],
    "Address": ["Address"],
    "City": ["City"],
    "State": ["State"],
    "Zip Code": ["Zip", "Zip Code"],
};

export async function syncCgmPtsSheet(projectId: string) {
    console.log(`Syncing CGM PTS sheet for project: ${projectId}`);
    try {
        const patientsSheet = await prisma.sheet.findFirst({
            where: { projectId, name: "Patients" },
            include: { columns: { orderBy: { order: 'asc' } }, rows: true }
        });
        const cgmSheet = await prisma.sheet.findFirst({
            where: { projectId, name: "CGM PTS" },
            include: { columns: { orderBy: { order: 'asc' } }, rows: true }
        });
        if (!patientsSheet || !cgmSheet) return;
        const itemCol = patientsSheet.columns.find(c => c.name.toLowerCase() === 'item');
        if (!itemCol) return;
        const patientsToSync = patientsSheet.rows.filter(row => {
            const data = row.data as Record<string, any>;
            const val = data[itemCol.id];
            return typeof val === 'string' && (val.toUpperCase() === 'CGM PTS' || val.toUpperCase() === 'CGM PST');
        });
        await prisma.row.deleteMany({ where: { sheetId: cgmSheet.id } });
        const patientCols = patientsSheet.columns;
        const cgmCols = cgmSheet.columns;
        for (let i = 0; i < patientsToSync.length; i++) {
            const pRow = patientsToSync[i];
            const pData = pRow.data as Record<string, any>;
            const newData: Record<string, any> = {};
            for (const [targetName, sourceNames] of Object.entries(mapping)) {
                const tCol = cgmCols.find(c => c.name.toLowerCase() === targetName.toLowerCase());
                if (!tCol) continue;
                const sCol = patientCols.find(c => sourceNames.some(sn => sn.toLowerCase() === c.name.toLowerCase()));
                if (sCol && pData[sCol.id] !== undefined) {
                    newData[tCol.id] = pData[sCol.id];
                }
            }
            await prisma.row.create({
                data: { sheetId: cgmSheet.id, data: newData, order: i }
            });
        }
    } catch (error) {
        console.error("Error during CGM PTS sync:", error);
    }
}
