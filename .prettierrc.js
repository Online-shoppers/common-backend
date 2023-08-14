module.exports = {
  plugins: [require('@trivago/prettier-plugin-sort-imports')],
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 80,
  arrowParens: 'avoid',
  endOfLine: 'auto',
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  importOrder: [
    '<THIRD_PARTY_MODULES>',

    '^app(.*)$',
    '^config(.*)$',
    '^migrations(.*)$',
    '^shared(.*)$',

    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
