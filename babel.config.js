module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-syntax-decorators', { legacy: true }],
    [
      'module-resolver',
      {
        alias: {
          '@src': './src'
        }
      }
    ]
  ],
  ignore: ['**/*.spec.ts', '**/*.test.ts', './src/**/__tests__/*']
}
