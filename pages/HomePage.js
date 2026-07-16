// pages/HomePage.js
// Represents the AutomationExercise home page (https://automationexercise.com)

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");

class HomePage extends BasePage {
    // ── URL ─────────────────────────────────────────────────────────────────
    static URL = "https://automationexercise.com";

    // ── Locators ─────────────────────────────────────────────────────────────
    // Navigation bar links
    static NAV_HOME = By.css("a[href='/']");
    static NAV_PRODUCTS = By.css("a[href='/products']");
    static NAV_CART = By.css("a[href='/view_cart']");
    static NAV_LOGIN = By.css("a[href='/login']");
    static NAV_LOGGED_IN = By.css("a[href='/logout']"); // only visible when logged in
    static NAV_LOGOUT = By.css("a[href='/logout']");
    static NAV_CONTACT = By.css("a[href='/contact_us']");

    // Hero / Featured section
    static SLIDER = By.id("slider-carousel");
    static FEATURED_ITEMS = By.css(".features_items .col-sm-4");
    static PRODUCT_NAMES = By.css(".features_items .productinfo p");
    static SUBSCRIPTION_EMAIL = By.id("susbscribe_email"); // typo is in the site HTML
    static SUBSCRIPTION_BTN = By.id("subscribe");
    static SUBSCRIPTION_MSG = By.css("#success-subscribe .alert-success");

    // ── Actions ──────────────────────────────────────────────────────────────

    /**
     * Navigate to the home page.
     * @returns {Promise<void>}
     */
    async open() {
        await super.open(HomePage.URL);
    }

    /**
     * Click the "Products" link in the nav bar.
     * @returns {Promise<void>}
     */
    async goToProducts() {
        await this.click(HomePage.NAV_PRODUCTS);
    }

    /**
     * Click the "Cart" link in the nav bar.
     * @returns {Promise<void>}
     */
    async goToCart() {
        await this.click(HomePage.NAV_CART);
    }

    /**
     * Click the "Signup / Login" link in the nav bar.
     * @returns {Promise<void>}
     */
    async goToLogin() {
        await this.click(HomePage.NAV_LOGIN);
    }

    /**
     * Click the "Logout" link in the nav bar.
     * @returns {Promise<void>}
     */
    async logout() {
        await this.click(HomePage.NAV_LOGOUT);
    }

    /**
     * Returns true when the nav bar shows the logged-in state (Logout link visible).
     * @returns {Promise<boolean>}
     */
    async isLoggedIn() {
        return this.isDisplayed(HomePage.NAV_LOGGED_IN);
    }

    /**
     * Get all visible featured product names on the home page.
     * @returns {Promise<string[]>}
     */
    async getFeaturedProductNames() {
        const elements = await this.findElements(HomePage.PRODUCT_NAMES);
        return Promise.all(elements.map((el) => el.getText()));
    }

    /**
     * Subscribe to the newsletter with the given email.
     * @param {string} email
     * @returns {Promise<void>}
     */
    async subscribeWithEmail(email) {
        await this.type(HomePage.SUBSCRIPTION_EMAIL, email);
        await this.click(HomePage.SUBSCRIPTION_BTN);
    }

    /**
     * Get the success message shown after subscribing.
     * @returns {Promise<string>}
     */
    async getSubscriptionSuccessMessage() {
        return this.getText(HomePage.SUBSCRIPTION_MSG);
    }

    // ── TODO for practice ────────────────────────────────────────────────────

    // TODO: Add a method `getNavLinks()` that returns all visible nav link texts as string[].
    // Hint: By.css("header li a") returns all nav items.

    // TODO: Add a method `scrollToFooter()` that uses driver.executeScript to scroll
    //       to the bottom of the page. Verify the footer copyright text is visible.
}

module.exports = HomePage;
