// Arquivo de config para testes de integracao desta pasta.
// Estes testes possuem nomenclatura do tipo "*.spec.ts"
const { resolve } = require('path')
const root = resolve(__dirname, '..')
const rootConfig = require(`${root}/jest.config.js`)

module.exports = {...rootConfig, ...{
  rootDir: root,
  displayName: "functional-tests",
  modulePathIgnorePatterns: ["<rootDir>/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
  testMatch: ["<rootDir>/test/**/*.spec.ts"],
}}