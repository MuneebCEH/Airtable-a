import { PrismaClient, Role } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const adminEmail = 'admin@example.com'

    // 1. Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Admin User',
            role: Role.ADMIN,
            // In real app, hash this password
            password: 'password123',
        },
    })

    // 2. Create Default Workspace
    const workspace = await prisma.workspace.create({
        data: {
            name: 'Default Workspace',
            members: {
                create: {
                    userId: admin.id,
                    role: Role.OWNER
                }
            }
        }
    })

    // 3. Create Project
    const project = await prisma.project.create({
        data: {
            name: 'Medical Records',
            description: 'Patient management project',
            workspaceId: workspace.id,
        }
    })

    // 4. Create Sheets (Full List)
    const sheetNames = [
        "Patients",
        "MED-B - Call Log",
        "CGM PTS",
        "Audits Records Request",
        "EOBs",
        "EOB Denial",
        "Overpayment",
        "Complaint Log",
        "CGM-Upcoming Orders",
        "CGM - Call Log",
        "Questions Pending Answers"
    ]

    const sheets = []
    for (const [index, name] of sheetNames.entries()) {
        const s = await prisma.sheet.create({
            data: {
                name,
                projectId: project.id,
                order: index,
            }
        })

        // Add specific columns for CGM PTS
        if (name === "CGM PTS" || name === "CGM PST") {
            const cgmCols = [
                { name: "Name", type: "TEXT" },
                { name: "Date in Dropbox", type: "DATE" },
                { name: "Completed", type: "CHECKBOX" },
                { name: "Voice Record", type: "CHECKBOX" },
                { name: "Clinical Notes", type: "CHECKBOX" },
                { name: "RX", type: "CHECKBOX" },
                { name: "No Match", type: "CHECKBOX" },
                { name: "Packing Slip", type: "CHECKBOX" },
                { name: "POD", type: "CHECKBOX" },
                { name: "Notes", type: "LONG_TEXT" },
                { name: "Tracking Number", type: "TEXT" },
                { name: "Delivery Status", type: "SELECT", options: ["Delivered", "In Transit", "Pending", "Exception", "Label Created"] },
                { name: "Delivered Date", type: "DATE" },
                { name: "Refill Due", type: "DATE" },
                { name: "Attachments", type: "FILE" },
                { name: "Returned", type: "CHECKBOX" },
                { name: "Medicare ID", type: "TEXT" },
                { name: "DOB", type: "DATE" },
                { name: "Address", type: "TEXT" },
                { name: "City", type: "TEXT" },
                { name: "State", type: "TEXT" },
                { name: "Zip Code", type: "TEXT" },
            ]
            for (const [ci, c] of cgmCols.entries()) {
                await prisma.column.create({
                    data: {
                        sheetId: s.id,
                        name: c.name,
                        type: c.type as any,
                        order: ci,
                        width: 150,
                        options: (c as any).options
                    }
                })
            }
        }
        sheets.push(s)
    }

    const patientsSheet = sheets.find(s => s.name === "Patients")!

    // 5. Create Columns for "Patients" (Full 35 Columns)
    const columnsData = [
        { id: "patientName", name: "Patient Name", type: "TEXT", width: 200 },
        { id: "dos", name: "DOS", type: "DATE", width: 120 },
        { id: "returned", name: "Returned", type: "CHECKBOX", width: 100 },
        { id: "complete", name: "Complete", type: "CHECKBOX", width: 100 },
        { id: "packingSlip", name: "Packing Slip", type: "CHECKBOX", width: 100 },
        { id: "hasVoiceRecord", name: "Has Voice Record", type: "CHECKBOX", width: 130 },
        { id: "rx", name: "RX", type: "CHECKBOX", width: 80 },
        { id: "clinicalNotes", name: "Clinical Notes", type: "CHECKBOX", width: 120 },
        { id: "sameSimilar", name: "Same/Similar", type: "CHECKBOX", width: 120 },
        { id: "pod", name: "POD", type: "CHECKBOX", width: 80 },
        { id: "attachments", name: "Attachments", type: "FILE", width: 150 },
        { id: "tracking", name: "Tracking", type: "TEXT", width: 150 },
        { id: "trackingStatus", name: "Tracking Status", type: "SELECT", width: 150, options: ["Delivered", "In Transit", "Pending", "Exception", "Label Created"] },
        { id: "deliveredDate", name: "Delivered Date", type: "DATE", width: 130 },
        { id: "notes", name: "Notes", type: "LONG_TEXT", width: 250 },
        { id: "address", name: "Address", type: "TEXT", width: 200 },
        { id: "city", name: "City", type: "TEXT", width: 150 },
        { id: "state", name: "State", type: "TEXT", width: 100 },
        { id: "zip", name: "Zip", type: "TEXT", width: 100 },
        { id: "dob", name: "DOB", type: "DATE", width: 120 },
        { id: "patientId", name: "Patient ID", type: "TEXT", width: 120 },
        { id: "item", name: "Item", type: "TEXT", width: 150 },
        { id: "productType", name: "Product Type", type: "TEXT", width: 150 },
        { id: "product", name: "Product", type: "SELECT", width: 150, options: ["L0457", "L1833", "L1906", "L3170"] },
        { id: "billed", name: "Billed", type: "CHECKBOX", width: 100 },
        { id: "paid", name: "Paid", type: "CURRENCY", width: 130 },
        { id: "amount", name: "Amount", type: "CURRENCY", width: 130 },
        { id: "secondaryPay", name: "Secondary Pay", type: "CURRENCY", width: 140 },
        { id: "deductible", name: "Deductible", type: "CURRENCY", width: 130 },
        { id: "billingNotes", name: "Billing Notes", type: "LONG_TEXT", width: 250 },
        { id: "reversalNeeded", name: "Reversal Needed", type: "CHECKBOX", width: 140 },
        { id: "method", name: "Method", type: "TEXT", width: 120 },
        { id: "completed", name: "Completed", type: "CHECKBOX", width: 100 },
        { id: "reversalForm", name: "Reversal Form", type: "FILE", width: 150 },
        { id: "lastModified", name: "Last Modified", type: "DATE", width: 160 },
        { id: "lastModifiedBy", name: "Last Modified By", type: "USER", width: 160 },
        { id: "reasonForReturn", name: "Reason for Return", type: "SELECT", width: 180, options: ["BAD STATE", "SNS FAILED", "No Answer"] },
        { id: "summaryState", name: "Summary (State)", type: "TEXT", width: 300 },
        { id: "refillDue", name: "Refill Due", type: "DATE", width: 130 },
    ]

    for (const [index, col] of columnsData.entries()) {
        await prisma.column.create({
            data: {
                sheetId: patientsSheet.id,
                name: col.name,
                type: col.type as any,
                order: index,
                width: col.width,
                options: col.options ?? undefined
            }
        })
    }

    // 6. Create Simple Sample Rows for Patients
    const columns = await prisma.column.findMany({ where: { sheetId: patientsSheet.id } })
    const colMap = columns.reduce((acc, col) => ({ ...acc, [col.name]: col.id }), {} as Record<string, string>)

    // Mock Row 1
    await prisma.row.create({
        data: {
            sheetId: patientsSheet.id,
            order: 0,
            data: {
                [colMap['Patient Name']]: 'John Doe',
                [colMap['DOS']]: '2025-01-20',
                [colMap['Returned']]: false,
                [colMap['Complete']]: true,
                [colMap['Packing Slip']]: true,
                [colMap['Has Voice Record']]: true,
                [colMap['RX']]: true,
                [colMap['Clinical Notes']]: true,
                [colMap['Same/Similar']]: false,
                [colMap['POD']]: true,
                [colMap['Attachments']]: [],
                [colMap['Tracking']]: 'TRACK12345',
                [colMap['Tracking Status']]: 'Delivered',
                [colMap['Delivered Date']]: '2025-01-22',
                [colMap['Notes']]: 'Delivered on time',
                [colMap['Address']]: '123 Main St',
                [colMap['City']]: 'New York',
                [colMap['State']]: 'NY',
                [colMap['Zip']]: '10001',
                [colMap['DOB']]: '1990-01-01',
                [colMap['Patient ID']]: 'PT001',
                [colMap['Item']]: 'Item A',
                [colMap['Product']]: 'L0457',
                [colMap['Billed']]: true,
                [colMap['Paid']]: '150.00',
                [colMap['Amount']]: '200.00',
                [colMap['Secondary Pay']]: '50.00',
                [colMap['Deductible']]: '0.00',
                [colMap['Billing Notes']]: 'Paid in full',
                [colMap['Reversal Needed']]: false,
                [colMap['Method']]: 'Check',
                [colMap['Completed']]: true,
                [colMap['Reversal Form']]: [],
                [colMap['Last Modified']]: new Date().toISOString(),
                [colMap['Last Modified By']]: 'Admin',
                [colMap['Reason for Return']]: 'No Answer',
                [colMap['Summary (State)']]: 'Processed'
            }
        }
    })

    // Mock Row 2
    await prisma.row.create({
        data: {
            sheetId: patientsSheet.id,
            order: 1,
            data: {
                [colMap['Patient Name']]: 'Jane Smith',
                [colMap['DOS']]: '2025-02-15',
                [colMap['Returned']]: true,
                [colMap['Complete']]: false,
                [colMap['Packing Slip']]: false,
                [colMap['Has Voice Record']]: false,
                [colMap['RX']]: true,
                [colMap['Clinical Notes']]: false,
                [colMap['Same/Similar']]: true,
                [colMap['POD']]: false,
                [colMap['Attachments']]: [],
                [colMap['Tracking']]: 'TRACK67890',
                [colMap['Tracking Status']]: 'Pending',
                [colMap['Delivered Date']]: '',
                [colMap['Notes']]: 'Pending delivery',
                [colMap['Address']]: '456 Oak Ave',
                [colMap['City']]: 'Los Angeles',
                [colMap['State']]: 'CA',
                [colMap['Zip']]: '90001',
                [colMap['DOB']]: '1985-05-15',
                [colMap['Patient ID']]: 'PT002',
                [colMap['Item']]: 'Item B',
                [colMap['Product']]: 'L1833',
                [colMap['Billed']]: false,
                [colMap['Paid']]: '0.00',
                [colMap['Amount']]: '250.00',
                [colMap['Secondary Pay']]: '0.00',
                [colMap['Deductible']]: '50.00',
                [colMap['Billing Notes']]: 'Waiting for insurance',
                [colMap['Reversal Needed']]: true,
                [colMap['Method']]: 'Electronic',
                [colMap['Completed']]: false,
                [colMap['Reversal Form']]: [],
                [colMap['Last Modified']]: new Date().toISOString(),
                [colMap['Last Modified By']]: 'Admin',
                [colMap['Reason for Return']]: 'BAD STATE',
                [colMap['Summary (State)']]: 'Pending'
            }
        }
    })

    console.log('Seed data created with full schema.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
