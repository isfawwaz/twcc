module.exports = {
  extends: ['kentcdodds', 'plugin:prettier/recommended'],
  plugins: ['simple-import-sort', 'jest'],
  rules: {
    // https://github.com/import-js/eslint-plugin-import
    'import/extensions': ['off'],
    'import/newline-after-import': ['warn'],
    'import/order': ['off'],
    'sort-imports': ['off'],

    // https://github.com/lydell/eslint-plugin-simple-import-sort
    'simple-import-sort/exports': ['warn'],
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^.+\\.s?css$'],
          ['^\\u0000'],
          ['^react$', '^react-dom$'],
          ['^~', '^@/'],
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ['^https?://'],
        ],
      },
    ],

    'max-lines': ['off'],
    'max-lines-per-function': ['off'],
    'no-void': ['off'],
    'one-var': ['off'],
    'require-await': ['off'],

    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },

  overrides: [
    {
      files: ['**/*.cjs', '**/*.mjs', '**/*.jsx', '**/*.js'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    {
      files: ['test/**', 'tests/**'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      rules: { 'jest/prefer-expect-assertions': 'off' },
    },
  ],
};
