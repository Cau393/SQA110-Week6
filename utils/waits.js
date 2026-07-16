const { until } = require("selenium-webdriver");

async function waitForVisible(driver, locator, timeout = 10000) {
    return driver.wait(until.elementIsVisible(driver.findElement(locator)), timeout);
}

async function waitForUrlContains(driver, fragment, timeout = 10000) {
    return driver.wait(until.urlContains(fragment), timeout);
}

async function waitForTitle(driver, expected, timeout = 10000) {
    return driver.wait(until.titleIs(expected), timeout);
}

module.exports = { waitForVisible, waitForUrlContains, waitForTitle };
