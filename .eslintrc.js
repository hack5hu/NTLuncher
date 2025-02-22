module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'no-unused-vars': 'warn',
    'no-console': 'error',
    'react/prop-types': 'off',
  }, 
};
