const { maskSecret } = require("../utils/logger");

console.log("maskSecret demo — sample password Test@12345:", maskSecret("Test@12345"));
console.log("maskSecret demo — short value abc:", maskSecret("abc"));
console.log("maskSecret demo — empty value:", maskSecret(""));
