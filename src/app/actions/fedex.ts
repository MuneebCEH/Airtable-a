"use server"

const FEDEX_API_KEY = "l744ba54ba45fd4cb4af5ce397d84148ea"
const FEDEX_SECRET_KEY = "79fa6162142a44b39422257bb981571b"
const FEDEX_BASE_URL = "https://apis.fedex.com" // Using production by default, switch to sandbox if needed: https://apis-sandbox.fedex.com

export async function getFedexAcccessToken() {
    const params = new URLSearchParams()
    params.append("grant_type", "client_credentials")
    params.append("client_id", FEDEX_API_KEY)
    params.append("client_secret", FEDEX_SECRET_KEY)

    try {
        const response = await fetch(`${FEDEX_BASE_URL}/oauth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("FedEx Token Error:", errorText)
            return null
        }

        const data = await response.json()
        return data.access_token
    } catch (error) {
        console.error("FedEx Auth Exception:", error)
        return null
    }
}

export async function getFedexTrackingStatus(trackingNumber: string) {
    if (!trackingNumber) return null

    const token = await getFedexAcccessToken()
    if (!token) {
        return { error: "Failed to authenticate with FedEx" }
    }

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
        }

        const response = await fetch(`${FEDEX_BASE_URL}/track/v1/trackingnumbers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-locale": "en_US"
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("FedEx Tracking Error:", errorText)
            return { error: "Failed to fetch tracking data" }
        }

        const data = await response.json()
        const trackResult = data.output?.completeTrackResults?.[0]?.trackResults?.[0]

        if (!trackResult) return { error: "No tracking info found" }

        const latestStatusDetail = trackResult.latestStatusDetail
        const latestStatus = latestStatusDetail?.statusByLocale || latestStatusDetail?.description || "Unknown"

        // Map FedEx status to our predefined dropdown options if possible
        let mappedStatus = "Pending"
        const statusLower = latestStatus.toLowerCase()

        if (statusLower.includes("delivered")) {
            mappedStatus = "Delivered"
        } else if (
            statusLower.includes("transit") ||
            statusLower.includes("way") ||
            statusLower.includes("pickup") ||
            statusLower.includes("ready") ||
            statusLower.includes("arrived") ||
            statusLower.includes("departed") ||
            statusLower.includes("out for delivery")
        ) {
            mappedStatus = "In Transit"
        } else if (
            statusLower.includes("label") ||
            statusLower.includes("initiated") ||
            statusLower.includes("data received")
        ) {
            mappedStatus = "Label Created"
        } else if (
            statusLower.includes("exception") ||
            statusLower.includes("delay") ||
            statusLower.includes("failed") ||
            statusLower.includes("attempt")
        ) {
            mappedStatus = "Exception"
        } else {
            // If we can't map it perfectly, stick to Pending or keep the original status if you want to support dynamic options (but our grid has fixed options)
            // For now, let's look for "Pending"
            mappedStatus = "Pending"
        }

        // Extract delivery date if available
        let deliveredDate = null
        if (trackResult.dateAndTimes) {
            const deliveryEvent = trackResult.dateAndTimes.find((dt: any) => dt.type === 'ACTUAL_DELIVERY')
            if (deliveryEvent) {
                deliveredDate = deliveryEvent.dateTime
            }
        }

        // Return the mapped status, raw description, and delivery date
        return {
            status: mappedStatus,
            description: latestStatus,
            deliveredDate: deliveredDate
        }

    } catch (error) {
        console.error("FedEx Tracking Exception:", error)
        return { error: "Exception during tracking" }
    }
}
