
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FEDEX_API_KEY = "l744ba54ba45fd4cb4af5ce397d84148ea";
const FEDEX_SECRET_KEY = "79fa6162142a44b39422257bb981571b";
const FEDEX_BASE_URL = "https://apis.fedex.com";

async function getFedexAcccessToken() {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", FEDEX_API_KEY);
    params.append("client_secret", FEDEX_SECRET_KEY);

    try {
        const response = await fetch(`${FEDEX_BASE_URL}/oauth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("FedEx Auth Exception:", error);
        return null;
    }
}

async function getFedexTrackingStatus(trackingNumber: string) {
    if (!trackingNumber) return null;
    const token = await getFedexAcccessToken();
    if (!token) return { error: "Failed to authenticate" };

    try {
        const payload = {
            includeDetailedScans: false,
            trackingInfo: [{ trackingNumberInfo: { trackingNumber } }]
        };

        const response = await fetch(`${FEDEX_BASE_URL}/track/v1/trackingnumbers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-locale": "en_US"
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) return { error: "Failed to fetch" };

        const data = await response.json();
        const trackResult = data.output?.completeTrackResults?.[0]?.trackResults?.[0];

        if (!trackResult) return { error: "No tracking info" };

        const latestStatusDetail = trackResult.latestStatusDetail;
        const latestStatus = latestStatusDetail?.statusByLocale || latestStatusDetail?.description || "Unknown";

        let mappedStatus = "Pending";
        const statusLower = latestStatus.toLowerCase();
        if (statusLower.includes("delivered")) mappedStatus = "Delivered";
        else if (statusLower.includes("transit") || statusLower.includes("way") || statusLower.includes("out for delivery")) mappedStatus = "In Transit";
        else if (statusLower.includes("label") || statusLower.includes("initiated")) mappedStatus = "Label Created";
        else if (statusLower.includes("exception") || statusLower.includes("delay")) mappedStatus = "Exception";

        let deliveredDate = null;
        if (trackResult.dateAndTimes) {
            const deliveryEvent = trackResult.dateAndTimes.find((dt: any) => dt.type === 'ACTUAL_DELIVERY');
            if (deliveryEvent) deliveredDate = deliveryEvent.dateTime;
        }

        return { status: mappedStatus, deliveredDate };
    } catch (error) {
        return { error: "Exception" };
    }
}

async function main() {
    console.log("Starting backfill process...");

    // 1. Find the relevant sheet and columns
    // We look for any sheet that has both "Tracking" and "Delivered Date" columns
    // But primarily we know it's likely the "Patients" sheet or similar.
    // Let's iterate all sheets to be safe or just find columns by name.

    // Get all columns named "Tracking"
    const trackingCols = await prisma.column.findMany({
        where: { name: "Tracking" }
    });

    if (trackingCols.length === 0) {
        console.log("No 'Tracking' columns found.");
        return;
    }

    let updatedCount = 0;

    for (const trackCol of trackingCols) {
        const sheetId = trackCol.sheetId;

        // Find corresponding "Delivered Date" and "Tracking Status" columns in the same sheet
        const statusCol = await prisma.column.findFirst({
            where: { sheetId, name: "Tracking Status" }
        });
        const dateCol = await prisma.column.findFirst({
            where: { sheetId, name: "Delivered Date" }
        });

        if (!dateCol) {
            console.log(`Sheet (ID: ${sheetId}) has Tracking but no 'Delivered Date' column. Skipping.`);
            continue;
        }

        console.log(`Processing Sheet ID: ${sheetId}...`);

        // Get all rows
        const rows = await prisma.row.findMany({
            where: { sheetId }
        });

        console.log(`Found ${rows.length} rows.`);

        for (const row of rows) {
            const data = row.data as Record<string, any>;
            const trackingNum = data[trackCol.id];

            if (trackingNum && typeof trackingNum === 'string' && trackingNum.length > 5) {
                console.log(`Checking Row ${row.id} - Tracking: ${trackingNum}`);

                const fedexRes = await getFedexTrackingStatus(trackingNum.trim());

                if (fedexRes && !fedexRes.error) {
                    let hasUpdates = false;

                    // Update Status if exists
                    if (statusCol && fedexRes.status) {
                        if (data[statusCol.id] !== fedexRes.status) {
                            data[statusCol.id] = fedexRes.status;
                            hasUpdates = true;
                            console.log(`  -> Updating Status: ${fedexRes.status}`);
                        }
                    }

                    // Update Date if exists
                    if (fedexRes.deliveredDate) {
                        if (data[dateCol.id] !== fedexRes.deliveredDate) {
                            data[dateCol.id] = fedexRes.deliveredDate;
                            hasUpdates = true;
                            console.log(`  -> Updating Date: ${fedexRes.deliveredDate}`);
                        }
                    } else if (fedexRes.status === 'Delivered') {
                        console.log(`  -> Warning: Status is Delivered but no date returned.`);
                    }

                    if (hasUpdates) {
                        await prisma.row.update({
                            where: { id: row.id },
                            data: { data }
                        });
                        updatedCount++;
                    } else {
                        console.log(`  -> No changes needed.`);
                    }
                } else {
                    console.log(`  -> Failed to fetch info.`);
                }
            }
        }
    }

    console.log(`Backfill complete. Updated ${updatedCount} rows.`);
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
