require("dotenv").config();

// Validate that credentials are set before the suite runs.
// Copy .env.example to .env and fill in your own values.
const required = ["TEST_EMAIL", "TEST_PASSWORD"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
    console.error(`\nMissing env vars: ${missing.join(", ")}. Copy .env.example to .env and fill them in.\n`);
    process.exit(1);
}
