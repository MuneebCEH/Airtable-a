const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Starting CGM PTS sheet update...");

    // 1. Find the "CGM PTS" sheet
    const sheet = await prisma.sheet.findFirst({
        where: { name: "CGM PTS" }
    });

    if (!sheet) {
        console.log("Sheet 'CGM PTS' not found.");
        return;
    }

    console.log(`Updating sheet: ${sheet.name} (ID: ${sheet.id})`);

    // 2. Delete existing columns and rows for this sheet to start fresh
    await prisma.column.deleteMany({ where: { sheetId: sheet.id } });
    await prisma.row.deleteMany({ where: { sheetId: sheet.id } });

    // 3. Define new columns
    const columns = [
        { name: "Name", type: "TEXT", width: 200 },
        { name: "Date in Dropbox", type: "DATE", width: 150 },
        { name: "Completed", type: "CHECKBOX", width: 100 },
        { name: "Voice Record", type: "CHECKBOX", width: 120 },
        { name: "Clinical Notes", type: "CHECKBOX", width: 130 },
        { name: "RX", type: "CHECKBOX", width: 80 },
        { name: "No Match", type: "CHECKBOX", width: 100 },
        { name: "Packing Slip", type: "CHECKBOX", width: 120 },
        { name: "POD", type: "CHECKBOX", width: 80 },
        { name: "notes", type: "LONG_TEXT", width: 250 },
        { name: "Tracking Number", type: "TEXT", width: 180 },
        { name: "Delivery Status", type: "TEXT", width: 150 },
        { name: "Attachments", type: "FILE", width: 150 },
        { name: "Returned", type: "CHECKBOX", width: 100 },
        { name: "Medicare ID", type: "TEXT", width: 150 },
        { name: "DOB", type: "DATE", width: 120 },
        { name: "Phone", type: "TEXT", width: 140 },
        { name: "Address", type: "TEXT", width: 200 },
        { name: "City", type: "TEXT", width: 150 },
        { name: "State", type: "TEXT", width: 80 },
        { name: "Zip Code", type: "TEXT", width: 100 },
        { name: "DR NAME", type: "TEXT", width: 180 },
        { name: "DR NPI NUMBER", type: "TEXT", width: 150 },
        { name: "Date of Appointment", type: "DATE", width: 150 },
        { name: "DEVICE TYPE", type: "SELECT", width: 150, options: ["Freestyle Libre 2", "Dexcom", "Freestyle 2"] },
        { name: "Refill Due", type: "DATE", width: 120 },
        { name: "RX Expires", type: "DATE", width: 120 },
        { name: "Welcome Call Date", type: "DATE", width: 150 },
        { name: "Satisfaction", type: "TEXT", width: 150 },
        { name: "Notes IBP", type: "LONG_TEXT", width: 200 },
        { name: "Notes Delta", type: "LONG_TEXT", width: 200 },
        { name: "JULY TRACKING", type: "TEXT", width: 180 },
        { name: "JULY RECEIVED DATE", type: "DATE", width: 150 },
        { name: "AUG TRACKING", type: "TEXT", width: 180 },
        { name: "AUG RECEIVED DATE", type: "DATE", width: 150 },
        { name: "SEPT TRACKING", type: "TEXT", width: 180 },
        { name: "SEPT RECEIVED DATE", type: "DATE", width: 150 },
        { name: "OCT TRACKING", type: "TEXT", width: 180 },
        { name: "OCT RECEIVED DATE", type: "DATE", width: 150 },
        { name: "NOV TRACKING", type: "TEXT", width: 180 },
        { name: "NOV RECEIVED DATE", type: "DATE", width: 150 },
        { name: "DEC TRACKING", type: "TEXT", width: 180 },
        { name: "DEC RECEIVED DATE", type: "DATE", width: 150 }
    ];

    const createdColumns = [];
    for (let i = 0; i < columns.length; i++) {
        const col = await prisma.column.create({
            data: {
                sheetId: sheet.id,
                name: columns[i].name,
                type: columns[i].type,
                order: i,
                width: columns[i].width,
                options: columns[i].options
            }
        });
        createdColumns.push(col);
    }

    const colMap = createdColumns.reduce((acc, col) => ({ ...acc, [col.name]: col.id }), {});

    // 4. Add Sample Data from images
    const sampleData = [
        {
            "Name": "Linda Costa",
            "Date in Dropbox": "2025-07-21",
            "Clinical Notes": true,
            "RX": true,
            "Packing Slip": true,
            "POD": true,
            "Tracking Number": "1Z92E88E0395431483",
            "Medicare ID": "2E85QV0KM96",
            "DOB": "1945-12-29",
            "Phone": "617-770-1723",
            "Address": "20 Maypole Rd.",
            "City": "Quincy",
            "State": "MA",
            "Zip Code": "02169",
            "DR NAME": "Anne Rogal",
            "DR NPI NUMBER": "1194715490",
            "Date of Appointment": "2025-04-10",
            "DEVICE TYPE": "Freestyle Libre 2",
            "JULY TRACKING": "1Z92E88E0395431483",
            "JULY RECEIVED DATE": "2025-07-30"
        },
        {
            "Name": "Monalisa Hawthorne",
            "Date in Dropbox": "2025-07-21",
            "Clinical Notes": true,
            "RX": true,
            "Packing Slip": true,
            "POD": true,
            "Tracking Number": "1Z92E88E0399901664",
            "Medicare ID": "5NK0KF8ET41",
            "DOB": "1951-05-27",
            "Phone": "3052571453",
            "Address": "25068 Sw 124Th Cl",
            "City": "Homestead",
            "State": "FL",
            "Zip Code": "33032",
            "DR NAME": "Yeissel Abrahantes Rodriguez",
            "DR NPI NUMBER": "1326542036",
            "Date of Appointment": "2025-03-31",
            "DEVICE TYPE": "Freestyle Libre 2",
            "JULY TRACKING": "1Z92E88E0399901664",
            "JULY RECEIVED DATE": "2025-07-29"
        },
        {
            "Name": "Ruthie Harmon",
            "Date in Dropbox": "2025-07-22",
            "Clinical Notes": true,
            "RX": true,
            "Packing Slip": true,
            "POD": true,
            "Tracking Number": "1Z92E88E0397855469",
            "Medicare ID": "6A76CD2HE79",
            "DOB": "1945-09-21",
            "Phone": "731-968-9296",
            "Address": "763 Franklin St",
            "City": "Lexington",
            "State": "TN",
            "Zip Code": "38351",
            "DR NAME": "Hannah Lee Kennedy",
            "DR NPI NUMBER": "1678785945",
            "Date of Appointment": "2025-02-07",
            "DEVICE TYPE": "Freestyle Libre 2",
            "JULY TRACKING": "1Z92E88E0397855469",
            "JULY RECEIVED DATE": "2025-07-29"
        }
    ];

    for (let i = 0; i < sampleData.length; i++) {
        const rowData = {};
        for (const [key, val] of Object.entries(sampleData[i])) {
            if (colMap[key]) {
                rowData[colMap[key]] = val;
            }
        }

        await prisma.row.create({
            data: {
                sheetId: sheet.id,
                order: i,
                data: rowData
            }
        });
    }

    console.log("CGM PTS sheet update complete.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
