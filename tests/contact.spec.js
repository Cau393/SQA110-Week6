// tests/contact.spec.js
// Tests for the Contact Us page on AutomationExercise.
//
// NOTE: Most test cases here are TODO — complete ContactUsPage methods first.

const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const ContactUsPage = require("../pages/ContactUsPage");

describe("Contact Us page", function () {
    let driver, contactUsPage;

    beforeEach(async function () {
        driver = await createDriver();
        contactUsPage = new ContactUsPage(driver);
        await contactUsPage.open();
    });

    afterEach(async function () {
        if (driver) await driver.quit();
    });

    // ── Passing tests (implemented) ──────────────────────────────────────────

    it("@smoke should load the Contact Us page with the correct heading", async function () {
        const heading = await contactUsPage.getHeading();
        expect(heading.toUpperCase()).to.equal("CONTACT US");
    });

    it("@regression should have the correct page URL", async function () {
        const url = await contactUsPage.getCurrentUrl();
        expect(url).to.include("/contact_us");
    });

    // ── TODO for practice ────────────────────────────────────────────────────

    // TODO 1: Test a successful contact form submission.
    //   Pre-condition: implement fillForm() and submitForm() in ContactUsPage first.
    //   Steps:
    //   - Call contactUsPage.fillAndSubmit("Test User", "test@example.com", "Test Subject", "Hello!")
    //   - Call getSuccessMessage() and assert it includes "Success! Your details have been submitted"
    //
    // it("should show a success message after submitting the contact form", async function () { ... });

    // TODO 2: Test that all form fields are visible.
    //   Steps:
    //   - Assert isDisplayed() returns true for NAME_INPUT, EMAIL_INPUT, SUBJECT_INPUT, MESSAGE_INPUT
    //   - Use Promise.all to check all four at once
    //
    // it("should display all form fields", async function () { ... });
});
