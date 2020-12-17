module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
};