module.exports = {
  '*.ts?(x)': ['eslint --cache --fix', () => 'tsc -p tsconfig.json --noEmit'],
  '*': 'prettier --ignore-unknown --write',
};
