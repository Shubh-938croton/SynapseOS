/**
 * CLI Manual Job Runner for SynapseOS Automation
 * Usage:
 *   node backend/src/scripts/runJob.js --job=daily [--date=YYYY-MM-DD] [--userId=1]
 *   node backend/src/scripts/runJob.js --job=weekly [--date=YYYY-MM-DD] [--userId=1]
 *   node backend/src/scripts/runJob.js --job=overdue [--date=YYYY-MM-DD] [--userId=1]
 */

const path = require("path");
const dotenv = require("dotenv");

// Ensure environment variables are loaded relative to backend root
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const { runDailySummaryJob, runWeeklySummaryJob, runOverdueTaskJob } = require("../jobs");

// Parse arguments
const args = process.argv.slice(2);
const options = {};

args.forEach((arg) => {
    if (arg.startsWith("--job=")) {
        options.job = arg.split("=")[1].toLowerCase().trim();
    } else if (arg.startsWith("--date=")) {
        options.date = arg.split("=")[1].trim();
    } else if (arg.startsWith("--userId=")) {
        options.userId = Number(arg.split("=")[1]);
    }
});

async function main() {
    console.log("==================================================");
    console.log("SYNAPSEOS AUTOMATION CLI RUNNER");
    console.log("==================================================");

    if (!options.job) {
        console.error("❌ Missing required argument: --job=<daily|weekly|overdue>");
        console.log("\nExamples:");
        console.log("  node src/scripts/runJob.js --job=daily");
        console.log("  node src/scripts/runJob.js --job=weekly --date=2026-09-21");
        console.log("  node src/scripts/runJob.js --job=overdue --userId=1");
        process.exit(1);
    }

    try {
        let result;
        switch (options.job) {
            case "daily":
                result = await runDailySummaryJob(options);
                break;
            case "weekly":
                result = await runWeeklySummaryJob(options);
                break;
            case "overdue":
                result = await runOverdueTaskJob(options);
                break;
            default:
                console.error(`❌ Unknown job type: '${options.job}'. Expected: daily, weekly, or overdue.`);
                process.exit(1);
        }

        console.log("\nExecution Result:", JSON.stringify(result, null, 2));

        if (result.status === "failed") {
            process.exit(1);
        } else {
            process.exit(0);
        }
    } catch (err) {
        console.error("❌ Fatal execution error:", err);
        process.exit(1);
    }
}

main();
