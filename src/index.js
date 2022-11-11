const fse = require('fs-extra');
const path = require('path');
const converters = require('./converters');
const { resolveConfig } = require('./converters/utils');
const chalk = require('chalk');

const allowedFormatsMap = {
  // stylus: converters.Stylus,
  // styl: converters.Stylus,
  // sass: converters.Sass,
  // scss: converters.Scss,
  // less: converters.Less,
  // json: converters.JSON,
  css: converters.Css,
};

/**
 * Converts tailwind config into desired format
 */
class ConvertTo {
  /**
   * @param options
   * @param {Object | String} options.config - Tailwind config. Could be either the tailwind config object or path to it
   * @param {String} [options.prefix] - Variable prefix
   * @param {String} [options.destination] - Output destination
   * @param {Boolean} [options.flat] - Whether the variables should be nested maps or flat level variables
   * @param {String} options.format - The desired format
   * @param {Boolean} [options.quotedKeys] - Whether SASS keys should be quoted. Both for Sass and SCSS.
   * @param {Number} [options.flattenMapsAfter] - After what nest level, do we want to flatten out nested maps.
   */
  constructor(options) {
    // eslint-disable-next-line no-prototype-builtins
    if (!allowedFormatsMap.hasOwnProperty(options.format)) {
      throw new Error(`${options.format} is not supported. Use ${Object.keys(allowedFormatsMap)}`);
    }
    this.options = options;

    const Converter = allowedFormatsMap[options.format];
    const config = resolveConfig(options.config);

    this.converterInstance = new Converter({ ...options, config });
  }

  /**
   * Converts the config and returns a string with in the new format
   * @returns {string}
   */
  convert() {
    return this.converterInstance.convert();
  }

  fileSplittingConfig() {
    return this.converterInstance.fileSplittingConfig();
  }

  /**
   * Write Tailwindcss config to file
   * @returns {Promise}
   */
  writeToFile() {
    return this._writeFile(this.convert(), {
      destination: this.options.destination,
      format: this.converterInstance.format,
      split: this.options.fileSplitting,
    });
  }

  /**
   * Internal method to write the supplied data to a tailwind config file with the desired format
   * @param {String} data
   * @param {String} destination
   * @param {String} format
   * @private
   * @return {Promise}
   */
  _writeFile(data, { destination, format, split = false }) {
    // If destination ends with a slash, we append a name to the file
    if (destination.endsWith(path.sep)) destination += 'tailwind-config';
    if (split) {
      const config = this.fileSplittingConfig();
      const promise = new Promise(async (resolve, reject) => {
        try {
          const d = [];
          // write file
          for (const file in data) {
            /* eslint-disable no-await-in-loop */
            if (data.hasOwnProperty(file)) {
              const buffer = data[file];
              const endPath = `${file}.${format}`;
              const fileUrl = path.join(process.cwd(), destination, endPath);

              await fse.outputFile(fileUrl, buffer);
              let includes = '';
              if (config.hasOwnProperty(file)) {
                includes = chalk.gray(`\n   - ${config[file].join('\n   - ')}`);
              }
              const text = chalk.bold.green([destination, endPath].join('/'));
              d.push(`${text}${includes}`);
            }
          }
          resolve({
            destination: ` - ${d.join(' \n - ')}`,
          });
        } catch (e) {
          reject(e);
        }
      });
      // asd
      return promise;
    } else {
      let buffer = '';
      if (this.options.format !== 'json') {
        buffer = `/* Converted Tailwind Config to ${this.options.format} */`;
      }
      buffer += data;

      const endPath = `${destination}.${format}`;
      const file = path.join(process.cwd(), endPath);

      return fse.outputFile(file, buffer).then(() => {
        return {
          destination: endPath,
        };
      });
    }
  }
}

module.exports = ConvertTo;
