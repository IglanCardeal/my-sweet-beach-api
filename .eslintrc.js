/* eslint-disable no-undef */
module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "space-before-function-paren": 0,
    "semi": 0,
    "@typescript-eslint/no-explicit-any": 0
  }
};
