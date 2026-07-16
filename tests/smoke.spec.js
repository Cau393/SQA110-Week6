// tests/smoke.spec.js
// Quick sanity check — verifies the site is reachable before running the full suite.

const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const HomePage = require("../pages/HomePage");

describe("Smoke — site reachability", function () {
    let driver, homePage;

    before(async function () {
        driver = await createDriver();
        homePage = new HomePage(driver);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it("@smoke AutomationExercise home page should load", async function () {
        await homePage.open();
        const title = await homePage.getTitle();
        expect(title).to.equal("Automation Exercise");
    });
});
