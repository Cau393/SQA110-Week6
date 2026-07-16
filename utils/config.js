const fs = require("fs");
const path = require("path");

function loadConfig() {
    const env = process.env.NODE_ENV || "default";
    const defaultPath = path.join(__dirname, "..", "config", "default.json");
    const envPath = path.join(__dirname, "..", "config", `${env}.json`);

    const defaults = JSON.parse(fs.readFileSync(defaultPath, "utf8"));
    let overrides = {};
    if (env !== "default" && fs.existsSync(envPath)) {
        overrides = JSON.parse(fs.readFileSync(envPath, "utf8"));
    }
    const merged = { ...defaults, ...overrides };

    // Overlay env-var values on top of the JSON defaults
    return {
        ...merged,
        baseUrl: process.env.BASE_URL || merged.baseUrl,
        browser: process.env.BROWSER || merged.browser,
        headless: process.env.HEADLESS === "true" || merged.headless,
        // Credentials — never hard-code these; they come from .env
        user: {
            email: process.env.TEST_EMAIL || "",
            password: process.env.TEST_PASSWORD || "",
        },
    };
}

module.exports = loadConfig();
