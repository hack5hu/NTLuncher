module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier
    'prettier', // Enables eslint-config-prettier
  ],
  settings: {
    react: {
      version: 'detect', // Auto-detect React version
    },
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'error',
    'react/prop-types': 'off',
  },
};
