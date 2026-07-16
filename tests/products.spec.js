// tests/products.spec.js
// Tests for the Products catalogue page on AutomationExercise.

const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const logger = require("../utils/logger");
const ProductsPage = require("../pages/ProductsPage");
const ProductDetailPage = require("../pages/ProductDetailPage");

describe("Products page", function () {
    let driver, productsPage, productDetailPage;

    beforeEach(async function () {
        driver = await createDriver();
        productsPage = new ProductsPage(driver);
        productDetailPage = new ProductDetailPage(driver);
        await productsPage.open();
    });

    afterEach(async function () {
        if (driver) await driver.quit();
    });

    // ── Passing tests (implemented) ──────────────────────────────────────────

    it("@smoke should display at least one product on the products page", async function () {
        const names = await productsPage.getAllProductNames();
        logger.info(`Found ${names.length} products`);
        expect(names.length).to.be.greaterThan(0);
    });

    it("@regression should return results when searching for 'Top'", async function () {
        await productsPage.searchFor("Top");
        const count = await productsPage.getSearchResultCount();
        logger.info(`Search for "Top" returned ${count} result(s)`);
        expect(count).to.be.greaterThan(0);
    });

    it("@regression should navigate to the product detail page when 'View Product' is clicked", async function () {
        await productsPage.viewFirstProduct();
        const url = await productsPage.getCurrentUrl();
        expect(url).to.include("/product_details/");
    });

    it("@regression should display the product name on the detail page", async function () {
        // Navigate directly by ID so the test is deterministic
        await productDetailPage.openById(1);
        const name = await productDetailPage.getProductName();
        logger.info(`Product 1 name: "${name}"`);
        expect(name).to.be.a("string").and.have.length.greaterThan(0);
    });

    it("@regression should display the product price on the detail page", async function () {
        await productDetailPage.openById(1);
        const price = await productDetailPage.getProductPrice();
        logger.info(`Product 1 price: "${price}"`);
        // AE prices look like "Rs. 500"
        expect(price).to.match(/Rs\.\s*\d+/);
    });

    // ── TODO for practice ────────────────────────────────────────────────────

    // TODO 1: Test that every product has a non-empty price.
    //   Steps:
    //   - Call getAllProductPrices()
    //   - forEach price, assert it is a non-empty string
    //
    // it("should display a price for every listed product", async function () { ... });

    // TODO 2: Test that searching for a keyword that doesn't exist returns 0 results
    //   OR shows an appropriate empty-state message.
    //   Steps:
    //   - searchFor("xyzabc123notarealproduct")
    //   - getSearchResultCount() — expect 0  (or assert a "no results" element is visible)
    //
    // it("should return 0 results for a non-existent product", async function () { ... });

    // TODO 3: Test that the product detail page shows a brand.
    //   Steps:
    //   - productDetailPage.openById(2)
    //   - Call getProductBrand()  (you implement that method in ProductDetailPage)
    //   - Expect the string to include "Brand:"
    //
    // it("should show the product brand on the detail page", async function () { ... });
});
