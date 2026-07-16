// pages/CartPage.js
// Represents the /view_cart page on AutomationExercise.

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");

class CartPage extends BasePage {
    // ── URL ─────────────────────────────────────────────────────────────────
    static URL = "https://automationexercise.com/view_cart";

    // ── Locators ─────────────────────────────────────────────────────────────
    // The cart table rows — each row is one product
    static CART_ROWS = By.css("#cart_info_table tbody tr");
    static CART_ITEM_NAMES = By.css("#cart_info_table .cart_description h4 a");
    static CART_ITEM_PRICES = By.css("#cart_info_table .cart_price p");
    static CART_ITEM_QTYS = By.css("#cart_info_table .cart_quantity button");
    static CART_ITEM_TOTALS = By.css("#cart_info_table .cart_total p");
    static DELETE_BUTTONS = By.css(".cart_quantity_delete");

    static PROCEED_TO_CHECKOUT = By.css("a.check_out");
    static EMPTY_CART_MSG = By.css("#empty_cart p");
    static CHECKOUT_LOGIN_LINK = By.css("#checkoutModal a[href='/login'], .modal-body a[href='/login']");

    // ── Actions ──────────────────────────────────────────────────────────────

    /**
     * Navigate to the cart page.
     * @returns {Promise<void>}
     */
    async open() {
        await super.open(CartPage.URL);
    }

    /**
     * Get the number of distinct items in the cart.
     * @returns {Promise<number>}
     */
    async getItemCount() {
        // Empty carts have no rows — do not wait for them to appear.
        const rows = await this.driver.findElements(CartPage.CART_ROWS);
        return rows.length;
    }

    /**
     * Wait until the cart contains at least the given number of items.
     * @param {number} [minCount=1]
     * @param {number} [timeout]
     */
    async waitForItems(minCount = 1, timeout = this.defaultTimeout) {
        await this.waitForCount(CartPage.CART_ROWS, minCount, timeout);
    }

    /**
     * Wait until guest checkout shows the login prompt modal or redirects to /login.
     * @param {number} [timeout]
     */
    async waitForCheckoutLoginPrompt(timeout = this.defaultTimeout) {
        await this.waitUntil(async () => {
            const modalLogin = await this.isCheckoutLoginPromptVisible();
            const url = await this.getCurrentUrl();
            return modalLogin || url.includes("/login");
        }, timeout);
    }

    /**
     * Whether the cart empty-state message is visible.
     * @returns {Promise<boolean>}
     */
    async isEmpty() {
        return this.isDisplayed(CartPage.EMPTY_CART_MSG);
    }

    /**
     * Get an array of all product names currently in the cart.
     * @returns {Promise<string[]>}
     */
    async getItemNames() {
        const elements = await this.findElements(CartPage.CART_ITEM_NAMES);
        return Promise.all(elements.map((el) => el.getText()));
    }

    /**
     * Get an array of all item prices in the cart.
     * @returns {Promise<string[]>}  e.g. ["Rs. 500", "Rs. 400"]
     */
    async getItemPrices() {
        const elements = await this.findElements(CartPage.CART_ITEM_PRICES);
        return Promise.all(elements.map((el) => el.getText()));
    }

    /**
     * Click "Proceed To Checkout" to move to the checkout flow.
     * If the user is not logged in, a modal will appear asking them to log in.
     * @returns {Promise<void>}
     */
    async proceedToCheckout() {
        await this.jsClick(CartPage.PROCEED_TO_CHECKOUT);
    }

    /**
     * Whether the guest checkout login/register prompt is visible.
     * @returns {Promise<boolean>}
     */
    async isCheckoutLoginPromptVisible() {
        return this.isDisplayed(CartPage.CHECKOUT_LOGIN_LINK);
    }

    /**
     * Remove the cart item at the given 1-based index by clicking its delete icon.
     * @param {number} index  1 = first item
     * @returns {Promise<void>}
     */
    async removeItemAtIndex(index) {
        const deleteButtons = await this.findElements(CartPage.DELETE_BUTTONS);
        if (index < 1 || index > deleteButtons.length) {
            throw new Error(`Delete index ${index} is out of range (1–${deleteButtons.length})`);
        }
        await deleteButtons[index - 1].click();
    }

    // ── TODO for practice ────────────────────────────────────────────────────

    // TODO 1: Implement `getItemQuantities()`.
    //   - Use findElements(CartPage.CART_ITEM_QTYS), map to getText().
    //   - Each quantity is shown as a string like "1". Return string[].

    // TODO 2: Implement `getItemTotals()`.
    //   - Same pattern, using CART_ITEM_TOTALS.

    // TODO 3: Implement `isEmpty()`.
    //   - Return true if EMPTY_CART_MSG is displayed (use isDisplayed()).
    //   - This message shows up when the cart has no items.

    // TODO 4: Implement `removeAllItems()`.
    //   - Call removeItemAtIndex(1) in a loop until getItemCount() returns 0.
    //   - Hint: re-fetch the count inside the loop because the DOM updates.
}

module.exports = CartPage;
