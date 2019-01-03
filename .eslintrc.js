module.exports = {
  extends: 'google',
  parserOptions: {
    ecmaVersion: 2017,
  },

  env: {
    es6: true,
  },
  rules: {
    indent: ['error', 2],
    'require-jsdoc': [
      2,
      {
        require: {
          FunctionDeclaration: false,
          MethodDefinition: false,
          ClassDeclaration: false,
        },
      },
    ],
  },
};
