// pages/ContactUsPage.js
// Represents the /contact_us page on AutomationExercise.
//
// NOTE: Most of this page is left as TODO for practice.

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");

class ContactUsPage extends BasePage {
    // ── URL ─────────────────────────────────────────────────────────────────
    static URL = "https://automationexercise.com/contact_us";

    // ── Locators ─────────────────────────────────────────────────────────────
    static NAME_INPUT = By.css("input[data-qa='name']");
    static EMAIL_INPUT = By.css("input[data-qa='email']");
    static SUBJECT_INPUT = By.css("input[data-qa='subject']");
    static MESSAGE_INPUT = By.css("textarea[data-qa='message']");
    static UPLOAD_FILE = By.css("input[name='upload_file']");
    static SUBMIT_BUTTON = By.css("input[data-qa='submit-button']");
    static SUCCESS_MSG = By.css("div.status.alert-success");
    static PAGE_HEADING = By.css("h2.title.text-center");

    // ── Actions ──────────────────────────────────────────────────────────────

    /**
     * Navigate to the Contact Us page.
     * @returns {Promise<void>}
     */
    async open() {
        await super.open(ContactUsPage.URL);
    }

    /**
     * Get the main heading text of the page (should be "Contact Us").
     * @returns {Promise<string>}
     */
    async getHeading() {
        return this.getText(ContactUsPage.PAGE_HEADING);
    }

    // ── TODO for practice ────────────────────────────────────────────────────

    // TODO 1: Implement `fillForm(name, email, subject, message)`.
    //   - Use this.type() for each of the four fields.
    //   - Order matters: name → email → subject → message.

    // TODO 2: Implement `submitForm()`.
    //   - Click SUBMIT_BUTTON.
    //   - After clicking, the browser shows a native JS alert saying "Press OK to proceed".
    //     Accept it with: await this.driver.switchTo().alert().accept();

    // TODO 3: Implement `getSuccessMessage()`.
    //   - After submitting, a green success div appears.
    //   - Use getText(ContactUsPage.SUCCESS_MSG) and return it.

    // TODO 4: Implement `fillAndSubmit(name, email, subject, message)`.
    //   - Combine fillForm() + submitForm() into one convenient helper method.
    //   - This is the method your test will call most of the time.
}

module.exports = ContactUsPage;
