const path = require("path");
const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const config = require("../utils/config");
const { readData } = require("../utils/data");
const LoginPage = require("../pages/LoginPage");

// Q10: Secrets and environment-specific values (real credentials, API tokens, base URLs)
// should not live in /data — use .env, CI secrets, or config/ instead. Ephemeral or
// generated data (random emails, users created mid-run) belongs in test setup/fixtures,
// not committed spreadsheets, since it changes every run and must not be shared in git.
//
// Source: data/login-data.xlsx (mirror in login-data.csv).
const source = process.env.DATA_SOURCE || "xlsx";
const dataPath = path.join(
    __dirname,
    `../data/login-data.${source === "csv" ? "csv" : "xlsx"}`
);

const main = readData(dataPath);
const edge = source === "csv" ? [] : readData(dataPath, "EdgeCases");

function resolveCredential(value) {
    if (value === "__VALID_EMAIL__") return config.user.email;
    if (value === "__VALID_PASSWORD__") return config.user.password;
    return value ?? "";
}

async function getLoginErrorSafe(loginPage) {
    try {
        return await loginPage.getLoginError();
    } catch {
        return "";
    }
}

async function assertExpected(driver, loginPage, expected) {
    if (expected === "success") {
        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            return !url.includes("/login");
        }, config.timeouts.explicit);
        const url = await driver.getCurrentUrl();
        expect(url).to.not.include("/login");
        return;
    }

    if (expected === "error") {
        const error = await getLoginErrorSafe(loginPage);
        expect(error).to.include("incorrect");
        return;
    }

    if (expected === "validation") {
        const url = await driver.getCurrentUrl();
        expect(url).to.include("/login");

        const emailEl = await driver.findElement(LoginPage.LOGIN_EMAIL);
        const passEl = await driver.findElement(LoginPage.LOGIN_PASSWORD);
        const emailValidation = await emailEl.getAttribute("validationMessage");
        const passwordValidation = await passEl.getAttribute("validationMessage");

        expect(emailValidation || passwordValidation).to.not.equal("");
        return;
    }

    throw new Error(`Unknown expected outcome: ${expected}`);
}

async function runLoginRow(driver, loginPage, row) {
    const email = resolveCredential(row.email);
    const password = resolveCredential(row.password);

    await loginPage.login(email, password);
    await assertExpected(driver, loginPage, row.expected);
}

describe("Login - Main", function () {
    let driver;
    let loginPage;

    beforeEach(async function () {
        driver = await createDriver();
        loginPage = new LoginPage(driver);
        await loginPage.open();
    });

    afterEach(async function () {
        if (driver) await driver.quit();
    });

    main.forEach((row) => {
        it(`[${row.testId}] ${row.testCase}`, async function () {
            await runLoginRow(driver, loginPage, row);
        });
    });
});

describe("Login - Edge Cases", function () {
    let driver;
    let loginPage;

    beforeEach(async function () {
        driver = await createDriver();
        loginPage = new LoginPage(driver);
        await loginPage.open();
    });

    afterEach(async function () {
        if (driver) await driver.quit();
    });

    edge.forEach((row) => {
        it(`[${row.testId}] ${row.testCase}`, async function () {
            await runLoginRow(driver, loginPage, row);
        });
    });
});
