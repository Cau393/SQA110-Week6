const xlsx = require('xlsx');

const readExcel = (filepath, sheetName) => {
    const workbook = xlsx.readFile(filepath);
    const targetSheet = sheetName || workbook.SheetNames[0];

    if (!workbook.Sheets[targetSheet]) {
        throw new Error(
            `Sheet "${targetSheet}" not found. Available sheets: ${workbook.SheetNames.join(', ')}`
        );
    }

    return xlsx.utils.sheet_to_json(workbook.Sheets[targetSheet]);
};

module.exports = {
    readExcel
};
