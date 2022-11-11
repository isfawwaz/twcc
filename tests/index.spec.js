const ConvertTo = require('../src/index');
const path = require('path');
const fse = require('fs-extra');

const testConfig = require('./config/tailwind.config');
const testConfigDisabledPlugins = require('./config/tailwind-disabled-plugins.config');

jest.mock('fs-extra');

describe('Tailwind Options Exporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not allow supplying unsupported formats', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new ConvertTo({
        config: testConfig,
        format: 'some_random',
        destination: 'doesnt_matter',
      });
    }).toThrow(/not supported/);
  });

  it('converts the config by using the proper converter', () => {
    const converterInstance = new ConvertTo({
      config: testConfig,
      format: 'css',
      destination: 'doesnt_matter',
    });

    expect(converterInstance.converterInstance.format).toBe('css');
  });

  it('skips options that are disabled in `corePlugins` using the object pattern', () => {
    const converterInstance = new ConvertTo({
      config: testConfigDisabledPlugins,
      format: 'css',
    });

    const cssConfig = converterInstance.convert();
    // assert it does not contain a few properties
    expect(cssConfig).not.toContain('border-radius');
    expect(cssConfig).not.toContain('bg-size');
  });

  it('skips options that are disabled in `corePlugins` using the array pattern', () => {
    const converterInstance = new ConvertTo({
      config: {
        ...testConfig,
        corePlugins: ['cursor'],
      },
      format: 'css',
    });

    const cssConfig = converterInstance.convert();
    // assert it does not contain a few properties
    expect(cssConfig).toContain('cursor');
    expect(cssConfig).not.toContain('backgroundSize');
    // assert the whole snapshot
    expect(cssConfig).toMatchSnapshot();
  });

  it('preserve keys that are set', () => {
    const converterInstance = new ConvertTo({
      config: testConfigDisabledPlugins,
      format: 'css',
      preserveKeys: ['colors', 'screens'],
    });

    const scssConfig = converterInstance.convert();

    // assert it does not contain a few properties
    expect(scssConfig).toContain('screen');
    expect(scssConfig).toContain('color');
  });

  it('onlyInclude keys that are set', () => {
    const converterInstance = new ConvertTo({
      config: testConfigDisabledPlugins,
      format: 'css',
      onlyIncludeKeys: ['colors', 'screens'],
    });

    const scssConfig = converterInstance.convert();

    // assert it does not contain a few properties
    expect(scssConfig).toContain('screen');
    expect(scssConfig).toContain('color');
    expect(scssConfig).not.toContain('bg-size');
  });

  it('properly includes the provided configuration properties', () => {
    const converterInstance = new ConvertTo({
      config: testConfig,
      format: 'css',
      destination: 'doesnt_matter',
      flat: true,
    });

    const cssConfig = converterInstance.convert();
    expect(cssConfig).toContain('--font-family-display: Gilroy, sans-serif;');
    expect(cssConfig).toContain('--text-color-cyan: #9cdbff;');
  });

  it('allows using an object as a config', () => {
    const converterInstance = new ConvertTo({
      config: {},
      format: 'css',
      destination: 'doesnt_matter',
    });

    expect(converterInstance.convert()).toEqual(expect.any(String));
  });

  it('allows using a path to an config', () => {
    const converterInstance = new ConvertTo({
      config: path.join(__dirname, 'config', 'tailwind.config.js'),
      format: 'css',
      destination: 'doesnt_matter',
    });
    expect(converterInstance.convert()).toEqual(expect.any(String));
  });

  it('writes the new config to a file', () => {
    return new Promise((done) => {
      fse.outputFile.mockImplementation(() => Promise.resolve());
      const converterInstance = new ConvertTo({
        config: path.join(__dirname, 'config/tailwind.config'),
        format: 'css',
        destination: 'doesnt_matter',
      });
      converterInstance.writeToFile().then(() => {
        expect(fse.outputFile).toHaveBeenCalled();
        done();
      });
    });
  });
});
