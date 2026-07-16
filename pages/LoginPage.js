// pages/LoginPage.js
// Handles both "Login" and "New User Signup" — they share the /login route on AE.

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");
const logger = require("../utils/logger");

class LoginPage extends BasePage {
    // ── URL ─────────────────────────────────────────────────────────────────
    static URL = "https://automationexercise.com/login";

    // ── Login form locators ──────────────────────────────────────────────────
    static LOGIN_EMAIL = By.css("input[data-qa='login-email']");
    static LOGIN_PASSWORD = By.css("input[data-qa='login-password']");
    static LOGIN_BUTTON = By.css("button[data-qa='login-button']");
    static LOGIN_ERROR = By.css("form[action='/login'] p"); // "Your email or password is incorrect!"

    // ── Signup form locators ─────────────────────────────────────────────────
    static SIGNUP_NAME = By.css("input[data-qa='signup-name']");
    static SIGNUP_EMAIL = By.css("input[data-qa='signup-email']");
    static SIGNUP_BUTTON = By.css("button[data-qa='signup-button']");
    static SIGNUP_ERROR = By.css("form[action='/signup'] p"); // "Email Address already exist!"

    // ── Actions ──────────────────────────────────────────────────────────────

    /**
     * Navigate to the Login / Signup page.
     * @returns {Promise<void>}
     */
    async open() {
        await super.open(LoginPage.URL);
    }

    /**
     * Log in with the given credentials.
     * @param {string} email
     * @param {string} password
     * @returns {Promise<void>}
     */
    async login(email, password) {
        logger.info(
            `Attempting login for user: ${logger.maskSecret(email)} (password: ${logger.maskSecret(password)})`
        );
        await this.type(LoginPage.LOGIN_EMAIL, email);
        await this.type(LoginPage.LOGIN_PASSWORD, password);
        await this.click(LoginPage.LOGIN_BUTTON);
    }

    /**
     * Get the error message text shown when login fails.
     * @returns {Promise<string>}
     */
    async getLoginError() {
        return this.getText(LoginPage.LOGIN_ERROR);
    }

    /**
     * Begin the signup flow: fill name + email, click "Signup" to reach the
     * registration form on the next page.
     * @param {string} name
     * @param {string} email
     * @returns {Promise<void>}
     */
    async startSignup(name, email) {
        await this.type(LoginPage.SIGNUP_NAME, name);
        await this.type(LoginPage.SIGNUP_EMAIL, email);
        await this.click(LoginPage.SIGNUP_BUTTON);
    }

    /**
     * Get the error message text shown when signup email already exists.
     * @returns {Promise<string>}
     */
    async getSignupError() {
        return this.getText(LoginPage.SIGNUP_ERROR);
    }

    // ── TODO for practice ────────────────────────────────────────────────────

    // TODO: Add a method `isLoginFormVisible()` that returns a boolean by checking
    //       whether LOGIN_EMAIL is displayed. Use the inherited `isDisplayed()` method.

    // TODO: Add a method `isSignupFormVisible()` that does the same for SIGNUP_NAME.
}

module.exports = LoginPage;
