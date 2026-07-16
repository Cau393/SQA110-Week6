// pages/ProductDetailPage.js
// Represents the /product_details/:id page on AutomationExercise.

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");

class ProductDetailPage extends BasePage {
    // ── URL helper ───────────────────────────────────────────────────────────
    // AutomationExercise product URLs look like: /product_details/1
    static urlFor(id) {
        return `https://automationexercise.com/product_details/${id}`;
    }

    // ── Locators ─────────────────────────────────────────────────────────────
    static PRODUCT_NAME = By.css(".product-information h2");
    static PRODUCT_PRICE = By.css(".product-information span span");
    static PRODUCT_CATEGORY = By.css(".product-information p:nth-child(3)");
    static PRODUCT_BRAND = By.css(".product-information p:nth-child(5)");
    static QUANTITY_INPUT = By.id("quantity");
    static ADD_TO_CART_BTN = By.css(".product-information button.cart");
    static CART_MODAL = By.css("#cartModal");
    static CART_MODAL_SHOWN = By.css("#cartModal.show, #cartModal.in");
    static VIEW_CART_LINK = By.css("#cartModal a[href='/view_cart']");
    static CONTINUE_SHOPPING_BTN = By.css("#cartModal button.close-modal");
    static WRITE_REVIEW_SECTION = By.css("#review-section");

    // ── Actions ──────────────────────────────────────────────────────────────

    /**
     * Navigate directly to a product detail page by its numeric ID.
     * @param {number} productId
     * @returns {Promise<void>}
     */
    async openById(productId) {
        await super.open(ProductDetailPage.urlFor(productId));
    }

    /**
     * Get the product name displayed on the detail page.
     * @returns {Promise<string>}
     */
    async getProductName() {
        return this.getText(ProductDetailPage.PRODUCT_NAME);
    }

    /**
     * Get the product price displayed on the detail page.
     * @returns {Promise<string>}  e.g. "Rs. 500"
     */
    async getProductPrice() {
        return this.getText(ProductDetailPage.PRODUCT_PRICE);
    }

    /**
     * Click Add to cart and wait until the confirmation modal is actually shown.
     * Native click is required — JS click can show a false "Added!" without updating the cart.
     * Note: #cartModal (and its View Cart link) always exist in the DOM while hidden;
     * we must wait for the `.show`/`.in` class, not merely for the link to be located.
     * @returns {Promise<void>}
     */
    async addToCart() {
        // Ads on AE often sit over the button; hide iframes so the native click lands.
        await this.driver.executeScript(
            "document.querySelectorAll('iframe').forEach((f) => { f.style.display = 'none'; });"
        );
        const btn = await this.findElement(ProductDetailPage.ADD_TO_CART_BTN);
        await this.driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btn);

        try {
            await btn.click();
        } catch (err) {
            // Retry once if an ad/overlay still intercepts the click.
            await this.driver.executeScript(
                "document.querySelectorAll('iframe').forEach((f) => { f.remove(); });"
            );
            await this.driver.executeScript("arguments[0].scrollIntoView({block:'center'});", btn);
            await btn.click();
        }

        await this.waitForVisible(ProductDetailPage.CART_MODAL_SHOWN);
    }

    /**
     * Dismiss the "Added!" modal via Continue Shopping.
     * @returns {Promise<void>}
     */
    async continueShopping() {
        await this.click(ProductDetailPage.CONTINUE_SHOPPING_BTN);
    }

    /**
     * Open the cart after a confirmed add.
     * Direct navigation is more reliable than the modal link under parallel load.
     * @returns {Promise<void>}
     */
    async viewCartFromModal() {
        await this.waitForVisible(ProductDetailPage.CART_MODAL_SHOWN);
        await this.open("https://automationexercise.com/view_cart");
    }

    // ── TODO for practice ────────────────────────────────────────────────────

    // TODO 1: Implement `getProductCategory()`.
    //   - Use getText(ProductDetailPage.PRODUCT_CATEGORY).
    //   - The raw text looks like "Category: Women > Tops". Return the whole string.

    // TODO 2: Implement `getProductBrand()`.
    //   - Use getText(ProductDetailPage.PRODUCT_BRAND).
    //   - The raw text looks like "Brand: Polo". Return the whole string.

    // TODO 3: Implement `setQuantity(amount)`.
    //   - Clear the QUANTITY_INPUT field and type the given amount (as a string).
    //   - Hint: use `this.type(ProductDetailPage.QUANTITY_INPUT, String(amount))`.
}

module.exports = ProductDetailPage;
