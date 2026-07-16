# SQA110 Framework — AutomationExercise.com Tests

Selenium-WebDriver-JS + Mocha + Chai + mochawesome automation framework  
for testing [https://automationexercise.com](https://automationexercise.com).  
Built as the SQA110 mid-course project.

# Q1 (Easy) — Install and Verify - Week 5
cauecasonato@Caues-MacBook-Air week_5 % npm ls xlsx csv-parse
sqa110-ae-framework@0.1.0 /Users/cauecasonato/Envs/SQA110/week_5
├── csv-parse@7.0.1
└── xlsx@0.18.5

## Stack

- Node.js v18+
- selenium-webdriver 4.x
- mocha 10.x + chai 4.x
- mochawesome reporter
- dotenv for credentials

## Installation

```shell
git clone https://github.com/<you>/sqa110-ae-framework.git
cd sqa110-ae-framework
npm install
cp .env.example .env
# Edit .env — add your automationexercise.com account email and password
```

> You need a real registered account on https://automationexercise.com for the login tests to pass.  
> Registration is free and takes ~1 minute.

## Configuration

| Variable        | File           | Purpose                                 |
| --------------- | -------------- | --------------------------------------- |
| `TEST_EMAIL`    | `.env`         | Email of your AE test account           |
| `TEST_PASSWORD` | `.env`         | Password of your AE test account        |
| `BASE_URL`      | `.env`         | Override the base URL (optional)        |
| `HEADLESS`      | `.env`         | `true` to run Chrome headless           |
| `BROWSER`       | `.env`         | `chrome` (default) or `firefox`         |
| `baseUrl`       | `default.json` | Default target — automationexercise.com |
| `timeouts`      | `default.json` | `explicit` (10 s), `pageLoad` (30 s)    |

## Running Tests

```shell
npm test                # Run all tests + generate HTML report
npm run test:headless   # Same, no visible browser
npm run test:smoke      # Run only @smoke-tagged tests (~1 min)
npm run report          # Open the HTML report in your browser
npm run clean           # Wipe mochawesome-report/ and screenshots/
```

## Project Structure

```
.
├── pages/
│   ├── BasePage.js           # Shared helpers (click, type, getText, isDisplayed…)
│   ├── HomePage.js           # / — nav, featured products, newsletter
│   ├── LoginPage.js          # /login — login + signup forms
│   ├── ProductsPage.js       # /products — catalogue, search, "View Product"
│   ├── ProductDetailPage.js  # /product_details/:id — name, price, add to cart  [mostly TODO]
│   ├── CartPage.js           # /view_cart — item list, remove, checkout
│   └── ContactUsPage.js      # /contact_us — contact form                       [mostly TODO]
├── tests/
│   ├── setup.js              # Validates .env before tests run
│   ├── smoke.spec.js         # Site reachability smoke test
│   ├── home.spec.js          # Home page tests
│   ├── login.spec.js         # Login / signup tests
│   ├── products.spec.js      # Product catalogue + detail page tests
│   ├── cart.spec.js          # Cart page tests
│   └── contact.spec.js       # Contact Us page tests
├── utils/
│   ├── driver.js             # DriverFactory — builds Chrome / Firefox
│   ├── config.js             # Merges default.json + env vars
│   ├── waits.js              # Explicit wait helpers
│   └── logger.js             # console-based logger (→ Winston in Week 6)
├── config/
│   └── default.json          # Non-secret defaults (timeouts, browser, baseUrl)
├── data/
│   └── users.json            # Test user fixtures
├── .env.example              # Template — commit this, NOT .env
├── .gitignore
├── .mocharc.js
└── package.json
```

## Adding a New Page

1. Create `pages/MyPage.js` extending `BasePage`.
2. Add a `static URL` and `static` locator constants (SCREAMING_SNAKE_CASE).
3. Add `async` action methods that describe **user intent** (`login()`, not `clickLoginButton()`).
4. Export with `module.exports = MyPage`.

## Adding a New Test

1. Create `tests/my-feature.spec.js`.
2. Wrap tests in `describe("Feature name", function () { ... })`.
3. Use `beforeEach` / `afterEach` to create and quit the driver.
4. Tag at least one test `@smoke` so it's included in the smoke run.
5. Run `npm test` to confirm it passes.

## Reading the Report

After `npm test`, run `npm run report` — this opens `mochawesome-report/index.html`.  
Pass/fail counts, durations, and stack traces on failures are all in there.

## TODO Checklist (practice exercises)

The following are intentionally left incomplete — work through them to practice:

- [ ] `ProductDetailPage` — `getProductCategory()`, `getProductBrand()`, `setQuantity()`, `addToCart()`
- [ ] `ContactUsPage` — `fillForm()`, `submitForm()`, `getSuccessMessage()`, `fillAndSubmit()`
- [ ] `ProductsPage` — `getSearchResultsHeader()`, `addFirstProductToCart()` (hover)
- [ ] `CartPage` — `getItemQuantities()`, `getItemTotals()`, `isEmpty()`, `removeAllItems()`
- [ ] `LoginPage` — `isLoginFormVisible()`, `isSignupFormVisible()`
- [ ] `HomePage` — `getNavLinks()`, `scrollToFooter()`
- [ ] All commented-out `it()` blocks in every test file
