module.exports = [
  {
    ignores: ['node_modules/**',
      'coverage/**',
      'allure-results/**',
      'allure-report/**'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs' },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'object-curly-spacing': ['error', 'always'],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }]
    }
  }
];
