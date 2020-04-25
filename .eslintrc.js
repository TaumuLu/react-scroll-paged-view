module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint'
  ],
  env: {
    es6: true,
    browser: true,
    node: true,
    mocha: true,
    'jest/globals': true
  },
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  rules: {
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/prefer-stateless-function': 0,
    'no-use-before-define': 0,
    'import/no-extraneous-dependencies': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/prop-types': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    'no-await-in-loop': 0,
    'no-restricted-syntax': 0,
    'interface-name': [0, 'never-prefix'],
    'import/extensions': [
      2,
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'no-underscore-dangle': 0,
    'react/static-property-placement': 0,
    'import/prefer-default-export': 0,
    'react/jsx-props-no-spreading': 0,
    'no-unused-expressions': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'react/no-array-index-key': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    'class-methods-use-this': 0,
    'max-classes-per-file': 0,
    'no-nested-ternary': 0
  }
}
