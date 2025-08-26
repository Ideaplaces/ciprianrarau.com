module.exports = {
  root: true,
  // Make sure eslint picks up the config at the root of the directory
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    // Use the latest ecmascript standard
    sourceType: 'module',
    // Allows using import/export statements
    ecmaFeatures: {
      jsx: true, // Enable JSX since we're using React
    },
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', './'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect', // Automatically detect the react version
    },
  },
  env: {
    browser: true,
    // Enables browser globals like window and document
    amd: true,
    // Enables require() and define() as global variables as per the amd spec.
    node: true,
    // Enables Node.js global variables and Node.js scoping.
    es6: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsonc/recommended-with-json',
    'plugin:jsonc/prettier',
    'plugin:storybook/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react/prop-types': 0,
    'prettier/prettier': [
      'error',
      {},
      {
        usePrettierrc: true,
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'import/no-named-as-default': 'off',
    'simple-import-sort/sort': 'error',
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
    'jsx-a11y/no-onchange': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref'],
      },
    ],
    '@next/next/no-img-element': 'off',
    'no-nested-ternary': 'off',
  },
  plugins: ['@typescript-eslint', 'jsonc', 'react-hooks', 'simple-import-sort'],
  overrides: [
    {
      files: ['*.json'],
      parser: 'jsonc-eslint-parser',
    },
    {
      files: ['lang/*.json', 'config/*.json'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/sort-keys': [
          'error',
          'asc',
          {
            caseSensitive: false,
          },
        ],
      },
    },
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      processor: '@graphql-eslint/graphql',
    },
    {
      files: ['*.gql'],
      extends: 'plugin:@graphql-eslint/schema-recommended',
    },
    {
      files: ['*.gql'],
      rules: {
        'prettier/prettier': 'off',
      },
    },
  ],
}
