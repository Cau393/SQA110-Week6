const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const URL = "https://practice.expandtesting.com/register";

async function createDriver() {
    const options = new chrome.Options();
    options.addArguments("--headless=new", "--window-size=1920,1080", "--no-sandbox");
    return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function submit(driver, { username, password, confirmPassword }) {
    await driver.get(URL);
    await driver.findElement(By.css("#username")).clear();
    await driver.findElement(By.css("#password")).clear();
    await driver.findElement(By.css("#confirmPassword")).clear();
    if (username !== undefined) await driver.findElement(By.css("#username")).sendKeys(String(username));
    if (password !== undefined) await driver.findElement(By.css("#password")).sendKeys(String(password));
    if (confirmPassword !== undefined) await driver.findElement(By.css("#confirmPassword")).sendKeys(String(confirmPassword));
    const submit = await driver.findElement(By.css("button[type='submit']"));
    await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", submit);
    await driver.executeScript("arguments[0].click();", submit);
    await driver.sleep(1500);
}

async function getOutcome(driver) {
    const url = await driver.getCurrentUrl();
    let flash = "";
    try {
        flash = await driver.findElement(By.css("#flash")).getText();
    } catch {
        flash = "";
    }
    return { url, flash };
}

async function main() {
    const driver = await createDriver();
    const results = [];
    const ts = Date.now();

    try {
        for (const len of [1, 3, 4, 6, 8, 64, 65]) {
            const pwd = "a".repeat(len);
            const user = `probe${len}${ts}`;
            await submit(driver, { username: user, password: pwd, confirmPassword: pwd });
            results.push({ type: "length", len, ...(await getOutcome(driver)) });
        }

        await submit(driver, { username: `mismatch${ts}`, password: "Passw0rd!", confirmPassword: "Different1!" });
        results.push({ type: "mismatch", ...(await getOutcome(driver)) });

        await submit(driver, { username: `success${ts}`, password: "Passw0rd!", confirmPassword: "Passw0rd!" });
        results.push({ type: "success", ...(await getOutcome(driver)) });

        const invalidEmails = [
            { label: "missing-at", email: "plainaddress" },
            { label: "double-at", email: "a@@b.com" },
            { label: "no-domain", email: "user@" },
            { label: "no-tld", email: "user@domain" },
            { label: "spaces", email: "user name@domain.com" },
        ];
        for (const item of invalidEmails) {
            const user = `${item.label}${ts}`;
            await submit(driver, { username: user, password: "Passw0rd!", confirmPassword: "Passw0rd!" });
            results.push({ type: "invalid-email-shape", shape: item.label, input: item.email, ...(await getOutcome(driver)) });
        }

        for (const item of invalidEmails) {
            await submit(driver, { username: item.email, password: "Passw0rd!", confirmPassword: "Passw0rd!" });
            results.push({ type: "invalid-email-as-username", shape: item.label, ...(await getOutcome(driver)) });
        }
    } finally {
        await driver.quit();
    }

    console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
