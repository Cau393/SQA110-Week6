const { createDriver } = require("../utils/driver");
const RegistrationPage = require("../pages/RegistrationPage");

async function submit(driver, { username, password, confirmPassword }) {
    const page = new RegistrationPage(driver);
    await page.open();
    await page.register({ username, password, confirmPassword });
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
