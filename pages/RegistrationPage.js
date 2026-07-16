const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");

class RegistrationPage extends BasePage {
    static URL = "https://practice.expandtesting.com/register";

    static USERNAME = By.css("#username");
    static PASSWORD = By.css("#password");
    static CONFIRM_PASSWORD = By.css("#confirmPassword");
    static SUBMIT = By.css("button[type='submit']");
    static FLASH = By.css("#flash");

    async open() {
        await super.open(RegistrationPage.URL);
    }

    async setInputValue(locator, text) {
        const el = await this.findElement(locator);
        await el.clear();
        const value = String(text);
        try {
            await el.sendKeys(value);
        } catch (err) {
            if (!String(err).includes("BMP")) throw err;
            await this.driver.executeScript(
                "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
                el,
                value
            );
        }
    }

    async register({ username, password, confirmPassword }) {
        if (username !== undefined && username !== null) {
            await this.setInputValue(RegistrationPage.USERNAME, username);
        }
        if (password !== undefined && password !== null) {
            await this.type(RegistrationPage.PASSWORD, String(password));
        }
        if (confirmPassword !== undefined && confirmPassword !== null) {
            await this.type(RegistrationPage.CONFIRM_PASSWORD, String(confirmPassword));
        }

        const submit = await this.findElement(RegistrationPage.SUBMIT);
        await this.driver.executeScript("arguments[0].scrollIntoView({block:'center'});", submit);
        await this.driver.executeScript("arguments[0].click();", submit);
    }

    async getFlashMessage() {
        return this.getText(RegistrationPage.FLASH);
    }

    /**
     * Wait until the server responds after submit: success redirects to /login,
     * validation failures render text in #flash on the register page.
     */
    async waitForRegistrationOutcome(timeout = this.defaultTimeout) {
        await this.driver.wait(async () => {
            if ((await this.getCurrentUrl()).includes("/login")) return true;
            try {
                return (await this.getFlashMessage()).length > 0;
            } catch {
                return false;
            }
        }, timeout);
    }
}

module.exports = RegistrationPage;
