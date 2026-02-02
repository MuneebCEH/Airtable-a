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

async function main() {
    const token = await getFedexAcccessToken();
    const num = "887944158110";
    const payload = { includeDetailedScans: false, trackingInfo: [{ trackingNumberInfo: { trackingNumber: num } }] };
    const response = await fetch(`${FEDEX_BASE_URL}/track/v1/trackingnumbers`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
    const data = await response.json();
    const trackResult = data.output?.completeTrackResults?.[0]?.trackResults?.[0];

    console.log("DateAndTimes:", JSON.stringify(trackResult.dateAndTimes, null, 2));
}

main();
