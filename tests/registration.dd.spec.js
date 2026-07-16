const path = require("path");
const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const config = require("../utils/config");
const { readData } = require("../utils/data");
const { validate } = require("../utils/validate");
const RegistrationPage = require("../pages/RegistrationPage");

// ExpandTesting /register has no email field. Spreadsheet columns follow the homework
// shape; at runtime email (if present) or firstName + lastName map to the username field.
// Unique suffixes for success rows use hyphens to stay within site username rules.
const source = process.env.DATA_SOURCE || "xlsx";
const dataPath = path.join(
    __dirname,
    `../data/registration-data.${source === "csv" ? "csv" : "xlsx"}`
);
const dataset = readData(dataPath);
validate(dataset);

const filter = process.env.TEST_FILTER || "";
const filtered = dataset.filter((row) => row.testId.startsWith(filter));

function buildUsername(row) {
    const email = (row.email ?? "").toString().trim();
    if (email) return email;
    return `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim();
}

function resolveUsername(row) {
    let username = buildUsername(row);
    if (row.expected === "pass" && username) {
        const suffix = `-${Date.now().toString(36)}`;
        const maxBaseLength = Math.max(3, 39 - suffix.length);
        if (username.length > maxBaseLength) {
            username = username.slice(0, maxBaseLength);
        }
        username = `${username}${suffix}`;
    }
    return username;
}

async function getFlashSafe(page) {
    try {
        return await page.getFlashMessage();
    } catch {
        return "";
    }
}

async function assertExpected(driver, page, row) {
    const timeout =
        row.expected === "pass"
            ? Math.max(config.timeouts.explicit, 30000)
            : Math.max(config.timeouts.explicit, 15000);
    await page.waitForRegistrationOutcome(timeout);

    if (row.expected === "pass") {
        expect(await page.getCurrentUrl()).to.include("/login");
        const flash = await getFlashSafe(page);
        expect(flash).to.include("Successfully registered");
        return;
    }

    if (row.expected === "fail") {
        expect(await getFlashSafe(page)).to.include(String(row.expectedError));
        return;
    }

    throw new Error(`Unknown expected outcome: ${row.expected}`);
}

describe("@regression Registration - Main", function () {
    let driver;
    let registrationPage;

    beforeEach(async function () {
        driver = await createDriver();
        registrationPage = new RegistrationPage(driver);
        await registrationPage.open();
    });

    afterEach(async function () {
        if (driver) {
            try {
                await driver.quit();
            } catch {
                /* session may already be closed after a timeout */
            }
            driver = null;
        }
    });

    filtered.forEach((row) => {
        it(`[${row.testId}] ${row.testCase}`, async function () {
            this.timeout(90000);
            await registrationPage.register({
                username: resolveUsername(row),
                password: row.password ?? "",
                confirmPassword: row.confirmPassword ?? "",
            });
            await assertExpected(driver, registrationPage, row);
        });
    });
});
