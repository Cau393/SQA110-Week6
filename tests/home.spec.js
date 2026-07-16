// tests/home.spec.js
// Tests for the AutomationExercise home page.

const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const logger = require("../utils/logger");
const HomePage = require("../pages/HomePage");

describe("Home page", function () {
    let driver, homePage;

    beforeEach(async function () {
        driver = await createDriver();
        homePage = new HomePage(driver);
        await homePage.open();
    });

    afterEach(async function () {
        if (driver) await driver.quit();
    });

    // ── Passing tests (implemented) ──────────────────────────────────────────

    it("@smoke should load with the correct page title", async function () {
        const title = await homePage.getTitle();
        expect(title).to.equal("Automation Exercise");
    });

    it("@regression should display featured products on the home page", async function () {
        const names = await homePage.getFeaturedProductNames();
        logger.info(`Home page shows ${names.length} featured product(s)`);
        expect(names.length).to.be.greaterThan(0);
    });

    it("@regression should show success message after newsletter subscription", async function () {
        await homePage.subscribeWithEmail("testsubscriber@example.com");
        const msg = await homePage.getSubscriptionSuccessMessage();
        expect(msg).to.include("You have been successfully subscribed!");
    });

    // ── TODO for practice ────────────────────────────────────────────────────

    // TODO 1: Test that clicking "Products" in the nav bar navigates to /products.
    //   Steps:
    //   - Call homePage.goToProducts()
    //   - Get current URL and assert it includes "/products"
    //
    // it("should navigate to the products page from the nav bar", async function () { ... });

    // TODO 2: Test that clicking "Cart" in the nav bar navigates to /view_cart.
    //   Steps:
    //   - Call homePage.goToCart()
    //   - Get current URL and assert it includes "/view_cart")
    //
    // it("should navigate to the cart page from the nav bar", async function () { ... });

    // TODO 3: Test that the user is NOT logged in by default (nav shows Login link, not Logout).
    //   Steps:
    //   - Call homePage.isLoggedIn()
    //   - Expect it to be false
    //
    // it("should not be logged in on first visit", async function () { ... });
});
