module.exports = {
  rules: {
    strict: 'off',
    'capitalized-comments': ['error'],
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'no-void': 'off',
    'no-shadow': 'off'
  },
  extends: [
    'airbnb-base',
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
    flushPromises: 'readonly',
    render: 'readonly'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', 'json', '.js', '.ts', 'json'],
        moduleDirectory: ['node_modules', './', '.']
      }
    }
  },
  overrides: [
    {
      files: ['*.test.js', '*.test.jsx'],
      rules: { 'no-restricted-imports': 'off' }
    }
  ],
  plugins: ['markdown', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 10, sourceType: 'module', ecmaFeatures: {} },
  env: { commonjs: true, es6: true, jest: true, node: true }
};
