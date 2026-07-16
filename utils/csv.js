const fs = require('fs');
const { parse } = require('csv-parse/sync');

const readCsv = (filepath) => {
    const content = fs.readFileSync(filepath, 'utf8');
    return parse(content, { bom: true, trim: true, columns: true, skip_empty_lines: true });
};

module.exports = {
    readCsv
};
