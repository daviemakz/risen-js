module.exports = {
  rules: {
    'no-void': 'off',
    strict: 'off',
    'no-shadow': 'off',
    'no-restricted-imports': ['error', { patterns: ['../*'] }]
  },
  extends: [
    'airbnb',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/babel',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:json/recommended',
    'prettier/standard',
    'airbnb',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:import/warnings',
    'plugin:json/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/babel',
    'prettier/standard'
  ],
  globals: {
    globalThis: 'readonly',
    global: 'readonly',
    self: 'readonly',
    window: 'readonly',
    Office: 'readonly',
    flushPromises: 'readonly',
    render: 'readonly'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', 'json', '.js', '.jsx', '.ts', '.tsx', 'json'],
        moduleDirectory: ['node_modules', './', '.', 'node_modules', './', '.']
      }
    }
  },
  overrides: [{ files: ['*.test.js', '*.test.jsx'], rules: { 'no-restricted-imports': 'off' } }],
  plugins: ['html', 'markdown', 'html', 'markdown', '@typescript-eslint', 'office-addins'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 10, sourceType: 'module', ecmaFeatures: {} },
  env: { commonjs: true, es6: true, jest: true, node: true }
};
