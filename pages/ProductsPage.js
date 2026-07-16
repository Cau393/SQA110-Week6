// pages/ProductsPage.js
// Represents the /products page — the full product catalogue on AutomationExercise.

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");

class ProductsPage extends BasePage {
    // ── URL ─────────────────────────────────────────────────────────────────
    static URL = "https://automationexercise.com/products";

    // ── Locators ─────────────────────────────────────────────────────────────
    // Search bar
    static SEARCH_INPUT = By.id("search_product");
    static SEARCH_BUTTON = By.id("submit_search");
    static SEARCH_RESULTS_HEADER = By.css("h2.title.text-center");

    // Product cards — each card is a .col-sm-4 inside .features_items
    static PRODUCT_CARDS = By.css(".features_items .col-sm-4");
    static PRODUCT_NAMES = By.css(".features_items .productinfo p");
    static PRODUCT_PRICES = By.css(".features_items .productinfo h2");
    // "View Product" links inside each card
    static VIEW_PRODUCT_LINKS = By.css(".features_items .choose a");

    // ── Actions ──────────────────────────────────────────────────────────────

    /**
     * Navigate to the Products page.
     * @returns {Promise<void>}
     */
    async open() {
        await super.open(ProductsPage.URL);
    }

    /**
     * Get all product names currently visible on the page.
     * @returns {Promise<string[]>}
     */
    async getAllProductNames() {
        const elements = await this.findElements(ProductsPage.PRODUCT_NAMES);
        return Promise.all(elements.map((el) => el.getText()));
    }

    /**
     * Get all product prices currently visible on the page.
     * @returns {Promise<string[]>}  e.g. ["Rs. 500", "Rs. 400", ...]
     */
    async getAllProductPrices() {
        const elements = await this.findElements(ProductsPage.PRODUCT_PRICES);
        return Promise.all(elements.map((el) => el.getText()));
    }

    /**
     * Search for a product by keyword.
     * @param {string} keyword
     * @returns {Promise<void>}
     */
    async searchFor(keyword) {
        await this.type(ProductsPage.SEARCH_INPUT, keyword);
        await this.click(ProductsPage.SEARCH_BUTTON);
    }

    /**
     * Get the result count after a search (number of product cards).
     * @returns {Promise<number>}
     */
    async getSearchResultCount() {
        const cards = await this.findElements(ProductsPage.PRODUCT_CARDS);
        return cards.length;
    }

    /**
     * Click "View Product" for the first product in the list.
     * Use this to navigate to the detail page.
     * @returns {Promise<void>}
     */
    async viewFirstProduct() {
        // Ads on AE often intercept native clicks; JS click is reliable here.
        await this.jsClick(ProductsPage.VIEW_PRODUCT_LINKS);
    }

    /**
     * Click "View Product" for the product at the given 1-based index.
     * @param {number} index  1 = first product
     * @returns {Promise<void>}
     */
    async viewProductAtIndex(index) {
        const links = await this.findElements(ProductsPage.VIEW_PRODUCT_LINKS);
        if (index < 1 || index > links.length) {
            throw new Error(`Product index ${index} is out of range (1–${links.length})`);
        }
        await links[index - 1].click();
    }

    // ── TODO for practice ────────────────────────────────────────────────────

    // TODO: Add a method `getSearchResultsHeader()` that returns the header text
    //       shown after a search (e.g. "Searched Products").
    //       Hint: use getText(ProductsPage.SEARCH_RESULTS_HEADER).

    // TODO: Add a method `addFirstProductToCart()` that hovers over the first
    //       product card and clicks the "Add to cart" overlay button.
    //       Hint: you need selenium-webdriver's `actions()` API for hovering.
    //       The overlay button selector is: .features_items .productinfo .btn
}

module.exports = ProductsPage;
