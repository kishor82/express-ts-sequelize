module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },
  plugins: ['check-file'],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'check-file/filename-blocklist': [
      'error',
      {
        '**/*.model.ts': '*.models.ts',
        '**/*.util.ts': '*.utils.ts'
      }
    ],
    'check-file/folder-match-with-fex': [
      'error',
      {
        '*.test.{js,jsx,ts,tsx}': '**/__tests__/',
        '*.styled.{jsx,tsx}': '**/pages/'
      }
    ],
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*.{jsx,tsx}': 'CAMEL_CASE',
        '**/*.{js,ts}': 'CAMEL_CASE'
      }
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        'src/**/': 'CAMEL_CASE',
        'mocks/*/': 'KEBAB_CASE'
      }
    ]
    // '@typescript-eslint/naming-convention': ['error', { selector: 'variableLike', format: ['camelCase', 'UPPER_CASE'] }],
    // '@typescript-eslint/naming-convention': [
    //   'error',
    //   {
    //     selector: 'variable',
    //     types: ['boolean'],
    //     format: ['PascalCase'],
    //     prefix: ['is', 'should', 'has', 'can', 'did', 'will']
    //   }
    // ]
  }
};
