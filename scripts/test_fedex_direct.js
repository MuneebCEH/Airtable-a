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
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("FedEx Token Error:", errorText);
            return null;
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("FedEx Auth Exception:", error);
        return null;
    }
}

async function getFedexTrackingStatus(token, trackingNumber) {
    try {
        const payload = {
            includeDetailedScans: false,
            trackingInfo: [
                {
                    trackingNumberInfo: {
                        trackingNumber: trackingNumber
                    }
                }
            ]
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

        if (!response.ok) {
            const errorText = await response.text();
            return { error: errorText };
        }

        const data = await response.json();
        const trackResult = data.output?.completeTrackResults?.[0]?.trackResults?.[0];

        if (!trackResult) return { error: "No tracking info found" };

        const latestStatusDetail = trackResult.latestStatusDetail;
        const latestStatus = latestStatusDetail?.statusByLocale || latestStatusDetail?.description || "Unknown";

        return {
            status: latestStatus,
            trackingNumber: trackingNumber
        };
    } catch (error) {
        return { error: error.message };
    }
}

async function main() {
    const token = await getFedexAcccessToken();
    if (!token) {
        console.log("Failed to get token");
        return;
    }
    console.log("Token obtained successfully.");

    const nums = ["887944158110", "397949048170", "887902149370", "887680944550", "887637898502", "887901305520"];
    for (const num of nums) {
        const status = await getFedexTrackingStatus(token, num);
        console.log(JSON.stringify(status));
    }
}

main();
