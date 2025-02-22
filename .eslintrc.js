module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'no-unused-vars': 'warn',
    'no-console': ['error', {allow: ['warn', 'error']}], // ❌ Disallow console.log but allow warn & error
    'react/prop-types': 'off',
  },
};
