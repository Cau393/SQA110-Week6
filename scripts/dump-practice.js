const xlsx = require('xlsx');
const { readCsv } = require('../utils/csv');

// XLSX
const workbook = xlsx.readFile('data/practice.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const data_xlsx = xlsx.utils.sheet_to_json(sheet);

// CSV
const data_csv = readCsv('data/practice.csv');

console.log("XLSX:", data_xlsx);
console.log("CSV:", data_csv);
