const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const config = require("./config");
const logger = require("./logger");

async function createDriver() {
    const headless = process.env.HEADLESS === "true" || config.headless;
    logger.info(`Starting Chrome driver in ${headless ? "headless" : "headed"} mode`);

    const options = new chrome.Options();

    if (headless) {
        options.addArguments("--headless=new");
    }

    options.addArguments("--window-size=1920,1080");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    // Reduce ad iframes that intercept clicks on AutomationExercise
    options.addArguments("--blink-settings=imagesEnabled=true");

    const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    await driver.manage().setTimeouts({
        pageLoad: config.timeouts.pageLoad,
        implicit: config.timeouts.implicit,
    });

    return driver;
}

module.exports = { createDriver };
