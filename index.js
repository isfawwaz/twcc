#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const runner = require('./src/runner');

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 --config [relative_path] --destination [relative_path] --format [css|scss]')
  .option('config', {
    alias: 'c',
    describe: 'Tailwind config file path',
    type: 'string' /* array | boolean | string */,
    nargs: 1,
    demand: true,
  })
  .option('destination', {
    alias: 'd',
    describe:
      'Path to save converted config file to, if split is true then this will be folder name',
    type: 'string' /* array | boolean | string */,
    nargs: 1,
    demand: true,
  })
  .option('format', {
    alias: 'f',
    describe: 'Format to generate',
    type: 'string',
    choices: ['css', 'scss', 'sass'],
    nargs: 1,
    demand: true,
  })
  .option('prefix', {
    describe: 'variable prefix',
    type: 'string' /* array | boolean | string */,
    nargs: 1,
  })
  .option('flat', {
    describe: 'Variable style (flat or nested map)',
    type: 'boolean' /* array | boolean | string */,
    boolean: true,
    nargs: 1,
  })
  .option('quoted-keys', {
    describe: 'Should map keys be quoted',
    type: 'boolean' /* array | boolean | string */,
    boolean: true,
    nargs: 1,
  })
  .option('flatten-maps-after', {
    describe:
      'After which level, should deeply nested maps be flattened out. Defaults to -1 (always)',
    type: 'number' /* array | boolean | string */,
    nargs: 1,
  })
  .option('preserve-keys', {
    describe: 'Keys to preserve',
    type: 'array' /* array | boolean | string */,
    nargs: 1,
    coerce: (array = []) => {
      return array.flatMap((v) => v.split(','));
    },
  })
  .option('only-include-keys', {
    describe: 'Keys to include exclusivly',
    type: 'array' /* array | boolean | string */,
    nargs: 1,
    coerce: (array = []) => {
      return array.flatMap((v) => v.split(','));
    },
  })
  .option('split', {
    describe: 'File splitting',
    type: 'boolean' /* array | boolean | string */,
    boolean: false,
  })
  .example('$0 --config tailwind.config.js --destination style --format css')
  .example('$0 -c tailwind.config.js -d style -f css --split').argv;

runner(argv);
