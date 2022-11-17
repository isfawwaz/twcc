const SassConverter = require('../../src/converters/sass');
const { resolveConfig } = require('../../src/converters/utils');

const testConfig = require('../config/tailwind.config');
const testConfigDefault = require('../config/tailwind-default.config');

describe('Sass converter', () => {
  describe('full config', () => {
    it('Converts to flat variables', () => {
      const converter = new SassConverter({
        config: resolveConfig(testConfigDefault),
        format: 'sass',
      });
      expect(converter.convert()).toMatchSnapshot();
    });
  });

  it('Converts flat and nested, with the same result', () => {
    let converter = new SassConverter({
      config: resolveConfig(testConfig),
      format: 'sass',
      flat: true,
    });
    const flatResult = converter.convert();

    converter = new SassConverter({
      config: resolveConfig(testConfig),
      format: 'sass',
      flat: false,
    });

    const nestedResult = converter.convert();

    expect(flatResult).toBe(nestedResult);
  });

  it('Converts to flat variables with prefix', () => {
    const converter = new SassConverter({
      config: resolveConfig(testConfig),
      flat: true,
      prefix: 'tw',
      format: 'sass',
    });
    expect(converter.convert()).toMatchSnapshot();
  });

  it('Converts to nested map with prefix', () => {
    const converter = new SassConverter({
      config: resolveConfig(testConfig),
      prefix: 'tw',
      format: 'sass',
    });
    expect(converter.convert()).toMatchSnapshot();
  });

  it('Converts split flat and nested, with the same result', () => {
    let converter = new SassConverter({
      config: resolveConfig(testConfig),
      flat: true,
      fileSplitting: true,
      format: 'sass',
    });
    const flatResult = converter.convert();

    converter = new SassConverter({
      config: resolveConfig(testConfig),
      flat: false,
      fileSplitting: true,
    });

    const nestedResult = converter.convert();

    expect(flatResult.toString()).toBe(nestedResult.toString());
  });

  it('Converts split to nested map with prefix', () => {
    const converter = new SassConverter({
      config: resolveConfig(testConfig),
      prefix: 'tw',
      fileSplitting: true,
      format: 'sass',
    });
    expect(converter.convert()).toMatchSnapshot();
  });
});
