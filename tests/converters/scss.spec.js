const ScssConverter = require('../../src/converters/scss');
const { resolveConfig } = require('../../src/converters/utils');

const testConfig = require('../config/tailwind.config');
const testConfigDefault = require('../config/tailwind-default.config');

describe('Scss converter', () => {
  describe('full config', () => {
    it('Converts to flat variables', () => {
      const converter = new ScssConverter({
        config: resolveConfig(testConfigDefault),
        format: 'scss',
      });
      expect(converter.convert()).toMatchSnapshot();
    });
  });

  it('Converts flat and nested, with the same result', () => {
    let converter = new ScssConverter({
      config: resolveConfig(testConfig),
      format: 'scss',
      flat: true,
    });
    const flatResult = converter.convert();

    converter = new ScssConverter({
      config: resolveConfig(testConfig),
      format: 'scss',
      flat: false,
    });

    const nestedResult = converter.convert();

    expect(flatResult).toBe(nestedResult);
  });

  it('Converts to flat variables with prefix', () => {
    const converter = new ScssConverter({
      config: resolveConfig(testConfig),
      flat: true,
      prefix: 'tw',
      format: 'scss',
    });
    expect(converter.convert()).toMatchSnapshot();
  });

  it('Converts to nested map with prefix', () => {
    const converter = new ScssConverter({
      config: resolveConfig(testConfig),
      prefix: 'tw',
      format: 'scss',
    });
    expect(converter.convert()).toMatchSnapshot();
  });

  it('Converts splitted flat and nested, with the same result', () => {
    let converter = new ScssConverter({
      config: resolveConfig(testConfig),
      flat: true,
      fileSplitting: true,
      format: 'scss',
    });
    const flatResult = converter.convert();

    converter = new ScssConverter({
      config: resolveConfig(testConfig),
      flat: false,
      fileSplitting: true,
    });

    const nestedResult = converter.convert();

    expect(flatResult.toString()).toBe(nestedResult.toString());
  });

  it('Converts splitted to nested map with prefix', () => {
    const converter = new ScssConverter({
      config: resolveConfig(testConfig),
      prefix: 'tw',
      fileSplitting: true,
      format: 'scss',
    });
    expect(converter.convert()).toMatchSnapshot();
  });
});
