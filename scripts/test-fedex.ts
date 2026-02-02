import { getFedexTrackingStatus } from "../src/app/actions/fedex";

async function testFedex() {
    const trackingNumbers = [
        "887944158110",
        "397949048170",
        "887902149370",
        "887680944550",
        "887637898502",
        "887901305520"
    ];

    console.log("Testing FedEx Connection...");

    for (const num of trackingNumbers) {
        process.stdout.write(`Checking ${num}... `);
        try {
            const result = await getFedexTrackingStatus(num);
            console.log(JSON.stringify(result));
        } catch (error) {
            console.error(`Error checking ${num}:`, error);
        }
    }
}

testFedex();
