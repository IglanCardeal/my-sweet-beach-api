/**
 * Arquivo para testes unitários que estarão junto dos arquivos a serem
 * testados.
 *
 * Arquivos de testes de integracão ficarão dentro da pasta "test".
 */

const { resolve } = require('path')
const root = resolve(__dirname)

module.exports = {
  rootDir: root,
  modulePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  displayName: 'unit-tests',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  coverageProvider: 'babel',
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1'
  }
}
