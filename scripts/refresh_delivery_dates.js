const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FEDEX_API_KEY = "l744ba54ba45fd4cb4af5ce397d84148ea";
const FEDEX_SECRET_KEY = "79fa6162142a44b39422257bb981571b";
const FEDEX_BASE_URL = "https://apis.fedex.com";

async function getFedexAcccessToken() {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", FEDEX_API_KEY);
    params.append("client_secret", FEDEX_SECRET_KEY);
    const response = await fetch(`${FEDEX_BASE_URL}/oauth/token`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: params });
    const data = await response.json();
    return data.access_token;
}

async function getFedexDetails(token, trackingNumber) {
    const payload = { includeDetailedScans: false, trackingInfo: [{ trackingNumberInfo: { trackingNumber: trackingNumber } }] };
    const response = await fetch(`${FEDEX_BASE_URL}/track/v1/trackingnumbers`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
    const data = await response.json();
    return data.output?.completeTrackResults?.[0]?.trackResults?.[0];
}

async function main() {
    const sheetId = 'cmkpqnyiq0007uwn88wcbxepj';
    const token = await getFedexAcccessToken();

    const columns = await prisma.column.findMany({ where: { sheetId: sheetId } });
    const trackingCol = columns.find(c => c.name.toLowerCase() === 'tracking');
    const statusCol = columns.find(c => c.name.toLowerCase() === 'tracking status');
    const dateCol = columns.find(c => c.name.toLowerCase() === 'delivered date');

    if (!trackingCol || !statusCol || !dateCol) {
        console.log("Required columns not found");
        return;
    }

    const rows = await prisma.row.findMany({ where: { sheetId: sheetId } });

    for (const row of rows) {
        const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        const trackingNum = data[trackingCol.id];

        if (trackingNum && trackingNum.trim().length > 5) {
            console.log(`Checking ${trackingNum}...`);
            const details = await getFedexDetails(token, trackingNum);
            if (details) {
                const latestStatus = details.latestStatusDetail?.statusByLocale || details.latestStatusDetail?.description || "Unknown";
                let delDate = null;
                if (details.dateAndTimes) {
                    const event = details.dateAndTimes.find(dt => dt.type === 'ACTUAL_DELIVERY');
                    if (event) delDate = event.dateTime.split('T')[0];
                }

                const newData = { ...data, [statusCol.id]: latestStatus };
                if (delDate) newData[dateCol.id] = delDate;

                await prisma.row.update({
                    where: { id: row.id },
                    data: { data: newData }
                });
                console.log(`Updated ${trackingNum} -> ${latestStatus} (${delDate || 'N/A'})`);
            }
        }
    }
}

main().finally(() => prisma.$disconnect());
