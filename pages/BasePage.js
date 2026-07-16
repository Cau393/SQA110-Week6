const { until } = require("selenium-webdriver");
const config = require("../utils/config");
const logger = require("../utils/logger");

class BasePage {
    constructor(driver, defaultTimeout = config.timeouts.explicit) {
        this.driver = driver;
        this.defaultTimeout = defaultTimeout;
    }

    _locatorLabel(locator) {
        return locator?.toString?.() ?? String(locator);
    }

    async open(url) {
        await this.driver.get(url);
    }

    async getTitle() {
        return this.driver.getTitle();
    }

    async getCurrentUrl() {
        return this.driver.getCurrentUrl();
    }

    async waitForVisible(locator, timeout = this.defaultTimeout) {
        logger.debug(`Waiting for element: ${this._locatorLabel(locator)} (${timeout}ms)`);
        const el = await this.driver.wait(until.elementLocated(locator), timeout);
        logger.debug(`Element located: ${this._locatorLabel(locator)}`);
        return el;
    }

    async waitForUrlContains(text, timeout = this.defaultTimeout) {
        logger.debug(`Waiting for URL to contain "${text}" (${timeout}ms)`);
        const result = await this.driver.wait(until.urlContains(text), timeout);
        logger.debug(`URL now contains "${text}"`);
        return result;
    }

    async waitForUrlNotContains(text, timeout = this.defaultTimeout) {
        logger.debug(`Waiting for URL to leave "${text}" (${timeout}ms)`);
        const result = await this.driver.wait(async () => {
            const url = await this.getCurrentUrl();
            return !url.includes(text);
        }, timeout);
        logger.debug(`URL no longer contains "${text}"`);
        return result;
    }

    /**
     * Wait until at least `count` elements match the locator.
     * @param {import("selenium-webdriver").By} locator
     * @param {number} count
     * @param {number} [timeout]
     */
    async waitForCount(locator, count, timeout = this.defaultTimeout) {
        logger.debug(
            `Waiting for at least ${count} match(es): ${this._locatorLabel(locator)} (${timeout}ms)`
        );
        const result = await this.driver.wait(async () => {
            const elements = await this.driver.findElements(locator);
            return elements.length >= count;
        }, timeout);
        logger.debug(`Count reached for: ${this._locatorLabel(locator)}`);
        return result;
    }

    /**
     * Wait until a custom condition returns true.
     * @param {() => Promise<boolean>} condition
     * @param {number} [timeout]
     * @param {string} [label]
     */
    async waitUntil(condition, timeout = this.defaultTimeout, label = "custom condition") {
        logger.debug(`Waiting for ${label} (${timeout}ms)`);
        const result = await this.driver.wait(condition, timeout);
        logger.debug(`Condition met: ${label}`);
        return result;
    }

    async findElement(locator) {
        await this.waitForVisible(locator);
        return this.driver.findElement(locator);
    }

    async click(locator) {
        const el = await this.findElement(locator);
        await el.click();
    }

    /**
     * Click via JS — bypasses overlays (e.g. ad iframes) that intercept native clicks.
     * @param {import("selenium-webdriver").By} locator
     */
    async jsClick(locator) {
        const el = await this.findElement(locator);
        await this.driver.executeScript(
            "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
            el
        );
    }

    async type(locator, text) {
        const el = await this.findElement(locator);
        await el.clear();
        await el.sendKeys(text);
    }

    async findElements(locator) {
        await this.waitForVisible(locator);
        return this.driver.findElements(locator);
    }

    async getText(locator) {
        const el = await this.findElement(locator);
        return el.getText();
    }

    async isDisplayed(locator) {
        try {
            const el = await this.driver.findElement(locator);
            return el.isDisplayed();
        } catch {
            return false;
        }
    }
}

module.exports = BasePage;
