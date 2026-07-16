const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const RegistrationPage = require("../pages/RegistrationPage");

async function createDriver() {
    const options = new chrome.Options();
    options.addArguments("--headless=new", "--window-size=1920,1080", "--no-sandbox");
    return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function submit(driver, { username, password, confirmPassword }) {
    const page = new RegistrationPage(driver);
    await page.open();
    await page.register({ username, password, confirmPassword });
    // Wait for /login redirect (success) or #flash banner (validation error) via
    // waitForRegistrationOutcome() — getOutcome() reads the page only after the server responds.
    await page.waitForRegistrationOutcome();
}

async function getOutcome(driver) {
    const page = new RegistrationPage(driver);
    const url = await page.getCurrentUrl();
    let flash = "";
    try {
        flash = await page.getFlashMessage();
    } catch {
        flash = "";
    }
    return { url, flash };
}

async function probePasswordLength(driver, len) {
    const pwd = "a".repeat(len);
    const user = `probe_len_${len}_${Date.now()}`;
    await submit(driver, { username: user, password: pwd, confirmPassword: pwd });
    const out = await getOutcome(driver);
    return { len, ...out };
}

async function main() {
    const driver = await createDriver();
    const results = [];

    try {
        for (const len of [1, 3, 4, 6, 8, 64, 65]) {
            results.push({ type: "length", ...(await probePasswordLength(driver, len)) });
        }

        await submit(driver, { username: "notanemail", password: "Passw0rd!", confirmPassword: "Passw0rd!" });
        results.push({ type: "invalid-email", ...(await getOutcome(driver)) });

        await submit(driver, { username: "", password: "Passw0rd!", confirmPassword: "Passw0rd!" });
        results.push({ type: "missing-username", ...(await getOutcome(driver)) });

        await submit(driver, { username: "probe_user", password: "", confirmPassword: "Passw0rd!" });
        results.push({ type: "missing-password", ...(await getOutcome(driver)) });

        await submit(driver, { username: "probe_user", password: "Passw0rd!", confirmPassword: "Different1!" });
        results.push({ type: "mismatch", ...(await getOutcome(driver)) });

        const successUser = `probe_success_${Date.now()}`;
        await submit(driver, { username: successUser, password: "Passw0rd!", confirmPassword: "Passw0rd!" });
        results.push({ type: "success", ...(await getOutcome(driver)) });
    } finally {
        await driver.quit();
    }

    console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
