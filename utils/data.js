const { readExcel } = require("./excel");
const { readCsv } = require("./csv");

function readData(filepath, sheetName) {
    if (filepath.endsWith(".xlsx") || filepath.endsWith(".xls")) {
        return readExcel(filepath, sheetName);
    }
    if (filepath.endsWith(".csv")) {
        return readCsv(filepath);
    }
    throw new Error(`Unsupported data file: ${filepath}`);
}

module.exports = {
    readData,
};
