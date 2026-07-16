// tests/cart.spec.js
// Tests for the Cart page on AutomationExercise.
//
// NOTE: Adding items to the cart requires hovering over product cards and clicking
// the overlay "Add to cart" button — that hover interaction is left as a TODO in
// ProductsPage. The tests below use direct URL navigation where possible, and
// mark the cart-addition flow as TODO.

const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const logger = require("../utils/logger");
const CartPage = require("../pages/CartPage");
const LoginPage = require("../pages/LoginPage");
const ProductDetailPage = require("../pages/ProductDetailPage");
const users = require("../data/users.json");

describe("Cart page", function () {
    let driver, cartPage, loginPage, productDetailPage;

    beforeEach(async function () {
        driver = await createDriver();
        cartPage = new CartPage(driver);
        loginPage = new LoginPage(driver);
        productDetailPage = new ProductDetailPage(driver);
    });

    afterEach(async function () {
        if (driver) {
            try {
                await driver.quit();
            } catch {
                /* session may already be closed */
            }
        }
    });

    // ── Passing tests (implemented) ──────────────────────────────────────────

    it("@smoke should load the cart page without errors", async function () {
        await cartPage.open();
        const url = await cartPage.getCurrentUrl();
        expect(url).to.include("/view_cart");
    });

    it("@regression should show 0 items when cart is empty (unauthenticated)", async function () {
        await cartPage.open();
        const count = await cartPage.getItemCount();
        logger.info(`Cart item count: ${count}`);
        expect(count).to.equal(0);
    });

    it("@regression should prompt login when proceeding to checkout as a guest", async function () {
        this.retries(1);

        // Empty carts hide the checkout button — add an item first.
        await productDetailPage.openById(1);
        await productDetailPage.addToCart();
        await productDetailPage.viewCartFromModal();

        await cartPage.waitForItems(1);
        await cartPage.proceedToCheckout();
        await cartPage.waitForCheckoutLoginPrompt();

        const modalLogin = await cartPage.isCheckoutLoginPromptVisible();
        const url = await cartPage.getCurrentUrl();
        expect(modalLogin || url.includes("/login")).to.equal(
            true,
            "Expected login modal or /login redirect after guest checkout"
        );
    });

    // ── TODO for practice ────────────────────────────────────────────────────

    // TODO 1: Test that a product added from the Products page appears in the cart.
    //   Pre-condition: implement addFirstProductToCart() in ProductsPage first.
    //   Steps:
    //   - Open ProductsPage, call addFirstProductToCart()
    //   - Navigate to CartPage
    //   - Assert getItemCount() === 1
    //
    // it("should contain the product after adding it from the products page", async function () { ... });

    // TODO 2: Test removing an item from the cart.
    //   Pre-condition: same as TODO 1 — need at least 1 item in cart.
    //   Steps:
    //   - Add a product, navigate to CartPage
    //   - Call removeItemAtIndex(1)
    //   - Assert getItemCount() === 0  (or isEmpty() === true — implement that too)
    //
    // it("should remove an item when the delete icon is clicked", async function () { ... });

    // TODO 3: Test the full "login → view cart" flow.
    //   Steps:
    //   - Log in via LoginPage
    //   - Open CartPage
    //   - Assert the page loads without errors (URL includes /view_cart)
    //
    // it("should allow a logged-in user to view the cart", async function () { ... });
});
