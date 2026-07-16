const logger = require("./utils/logger");

exports.mochaHooks = {
    beforeEach() {
        logger.info(`Test start: ${this.currentTest.fullTitle()}`);
    },
    afterEach() {
        logger.info(
            `Test state: ${this.currentTest.fullTitle()} — ${this.currentTest.state}`
        );
    },
};
