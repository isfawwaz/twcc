const { isObject, sanitizeKey, indentWith, camelToString, getKeyByValue } = require('./utils');

const INDENT_BY = 2;

const replacer = {
  screens: 'screen',
  fontFamily: '',
  borderWidth: '',
  supports: 'support',
  colors: 'color',
  columns: 'column',
  spacing: '',
  animation: '',
  aria: '',
  aspectRatio: '',
  backdropBlur: '',
  backdropBrightness: '',
  backdropContrast: '',
  backdropGrayscale: '',
  backdropHueRotate: '',
  backdropInvert: '',
  backdropOpacity: '',
  backdropSaturate: '',
  backdropSepia: '',
  backgroundColor: 'bgColor',
  backgroundImage: 'bgImage',
  backgroundOpacity: 'bgOpacity',
  backgroundPosition: 'bgPosition',
  backgroundSize: 'bgSize',
  blur: '',
  brightness: '',
  borderColor: '',
  borderOpacity: '',
  borderRadius: '',
  borderSpacing: '',
  boxShadow: '',
  boxShadowColor: '',
  caretColor: '',
  accentColor: '',
  contrast: '',
  container: '',
  content: '',
  cursor: '',
  divideColor: '',
  divideOpacity: '',
  divideWidth: '',
  dropShadow: '',
  fill: '',
  grayscale: '',
  hueRotate: '',
  invert: '',
  flex: '',
  flexBasis: '',
  flexGrow: '',
  flexShrink: '',
  fontSize: '',
  fontWeight: '',
  gap: '',
  gradientColorStops: '',
  gridAutoColumns: '',
  gridAutoRows: '',
  gridColumn: '',
  gridColumnEnd: '',
  gridColumnStart: '',
  gridRow: '',
  gridRowStart: '',
  gridRowEnd: '',
  gridTemplateColumns: '',
  gridTemplateRows: '',
  height: '',
  inset: '',
  keyframes: 'keyframe',
  letterSpacing: '',
  lineHeight: '',
  listStyleType: '',
  margin: '',
  maxHeight: '',
  maxWidth: '',
  minHeight: '',
  minWidth: '',
  objectPosition: '',
  opacity: '',
  order: '',
  padding: '',
  placeholderColor: '',
  placeholderOpacity: '',
  outlineColor: '',
  outlineOffset: '',
  outlineWidth: '',
  ringColor: '',
  ringOffsetColor: '',
  ringOffsetWidth: '',
  ringOpacity: '',
  ringWidth: '',
  rotate: '',
  saturate: '',
  scale: '',
  scrollMargin: '',
  scrollPadding: '',
  sepia: '',
  skew: '',
  space: '',
  stroke: '',
  strokeWidth: '',
  textColor: '',
  textDecorationColor: '',
  textDecorationThickness: '',
  textUnderlineOffset: '',
  textIndent: '',
  textOpacity: '',
  transformOrigin: '',
  transitionDelay: '',
  transitionDuration: '',
  transitionProperty: '',
  transitionTimingFunction: '',
  translate: '',
  width: '',
  willChange: '',
  zIndex: '',
};

/**
 * General converter class. To be extended by any specific format converter.
 */
class Converter {
  /** @type {string} - the format and file extension */
  format;
  /** @type {object} - the resolved theme configuration settings */
  theme = {};
  /** @type {object} - tailwind specific configurations */
  configs = {};

  /** @type {string} - the symbol that starts a map */
  mapOpener = '(\n';
  /** @type {string} - the symbol that ends a map */
  mapCloser = ')';
  /** @type {boolean} - should map keys be quoted */
  quotedKeys = false;
  /** @type {number} - should try to flatten deep maps after N level */
  flattenMapsAfter = -1;
  /** @type {array} - config keys to preserve */
  preserveKeys = [];
  onlyIncludeKeys = [];
  prefixContent = '';
  suffixContent = '';

  /**
   * @param opts
   * @param {Object} opts.config - Tailwind config object
   * @param {Boolean} opts.flat - Is flat or not
   * @param {String} opts.prefix - If we want a variable prefix
   * @param {Boolean} [opts.quotedKeys] - Should map keys be quoted
   * @param {Number} [opts.flattenMapsAfter] - Should flatten maps after N level
   * @param {Array} [opts.preserveKeys] - config keys to preserve
   */
  constructor(opts) {
    const { theme, ...rest } = opts.config;
    this.theme = theme;
    this.configs = rest;

    this.flat = opts.flat;
    this.prefix = opts.prefix || '';
    this.fileSplitting = opts.fileSplitting;
    if (opts.quotedKeys) this.quotedKeys = opts.quotedKeys;
    if (typeof opts.flattenMapsAfter !== 'undefined') this.flattenMapsAfter = opts.flattenMapsAfter;
    if (typeof opts.preserveKeys !== 'undefined') this.preserveKeys = opts.preserveKeys;
    if (typeof opts.onlyIncludeKeys !== 'undefined') this.onlyIncludeKeys = opts.onlyIncludeKeys;
  }

  /**
   * Converts the options config to the required format.
   * @returns {string}
   */
  convert() {
    if (this.fileSplitting) {
      // do file splitting
      const bufferArray = {};
      const themes = {};
      Object.keys(this.fileSplittingConfig())
        .sort()
        .forEach((key) => {
          themes[key] = [];
          bufferArray[key] = this.prefixContent;
        });
      for (const setting in this.theme) {
        if (this.theme.hasOwnProperty(setting) && this._isSettingEnabled(setting)) {
          const data = this.theme[setting];
          const key = getKeyByValue(this.fileSplittingConfig(), setting);
          if (themes.hasOwnProperty(key)) {
            const body = this.flat
              ? this._convertObjectToVar(setting, data)
              : this._convertObjectToMap(setting, data);
            themes[key].push(body);
          }
        }
      }
      for (const theme in themes) {
        if (themes.hasOwnProperty(theme)) {
          const list = themes[theme];
          list.sort();
          list.forEach((body) => {
            bufferArray[theme] += '\n';
            bufferArray[theme] += body;
          });
          bufferArray[theme] += this.suffixContent;
        }
      }
      return bufferArray;
    } else {
      let buffer = this.prefixContent;
      for (const setting in this.theme) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.theme.hasOwnProperty(setting) && this._isSettingEnabled(setting)) {
          const data = this.theme[setting];

          const body = this.flat
            ? this._convertObjectToVar(setting, data)
            : this._convertObjectToMap(setting, data);

          buffer += '\n';
          buffer += body;
        }
      }

      buffer += this.suffixContent;
      return buffer;
    }
  }

  /**
   * Returns a variable format for the style class
   * @param {string} name
   * @param {string} value
   * @private
   */
  _buildVar(name, value) {
    return `--${name}: ${value};\n`;
  }

  /**
   * Return separator used for naming
   * @private
   * @return {string}
   */
  _separator() {
    return '-';
  }

  _isPropertyConvertToString() {
    return false;
  }

  /**
   * Return a string variable of property name
   * @param {string} name
   * @param {string} variant
   * @private
   */
  _buildPropertyName(name, variant) {
    return [this._replacePropertyName(name), variant?.toLowerCase()]
      .filter(Boolean)
      .join(this._separator());
  }

  _replacePropertyName(name) {
    let result = name;
    // eslint-disable-next-line no-prototype-builtins
    if (replacer.hasOwnProperty(name) && replacer[name]) {
      result = replacer[name];
    }

    if (this._isPropertyConvertToString()) {
      result = camelToString(result, this._separator());
    }

    return result;
  }

  /**
   * Converts the supplied data to a list of variables
   * @param prop
   * @param data
   * @private
   */
  _convertObjectToVar(prop, data) {
    return this._walkFlatRecursively(data, prop).join('');
  }

  /**
   * Converts the supplied data to a list of nested map objects
   * @private
   * @param {string} property
   * @param {object} data
   * @return {string}
   */
  _convertObjectToMap(property, data) {
    return this._buildVar(this._propertyNameSanitizer(property), this._buildMap(data));
  }

  _walkFlatRecursively(value, parentPropertyName) {
    return Object.entries(value).reduce((all, [propertyName, propertyValue]) => {
      const isParentArray = Array.isArray(value);
      // construct the var name. If parent was an array, we skip the index keys
      const property = this._buildPropertyName(
        parentPropertyName,
        isParentArray ? null : propertyName,
      );

      const val = this._shouldContinueWalking(propertyValue)
        ? this._walkFlatRecursively(propertyValue, property)
        : this._buildVar(
            this._propertyNameSanitizer(property),
            this._sanitizePropValue(propertyValue),
          );

      return all.concat(val);
    }, []);
  }

  _shouldContinueWalking(value) {
    return isObject(value) || (Array.isArray(value) && value.some(isObject));
  }

  /**
   * Sanitizes a value, escaping and removing symbols
   * @param {*} value
   * @return {string|*}
   * @private
   */
  _sanitizePropValue(value) {
    if (Array.isArray(value)) return `(${value})`.replace(/\\"/g, '"');
    if (
      // if its a string
      typeof value === 'string' &&
      // and has comma's in it
      value.includes(',') &&
      // but is not a concatenated map
      !value.startsWith(this.mapOpener)
    ) {
      return `(${value})`;
    }
    return value;
  }

  /**
   * Sanitizes a property name by escaping characters
   * Adds prefix
   * @param {string} property - the property (colors, backgroundColors)
   * @return {string}
   * @private
   */
  _propertyNameSanitizer(property) {
    property = sanitizeKey(property.replace(/\//g, '\\/').replace(/\./g, '\\.'));
    return [this.prefix, property].filter((v) => v).join('-');
  }

  /**
   * Builds a map object with indentation
   * @param data
   * @param indent
   * @return {string}
   * @private
   */
  _buildMap(data, indent = 0) {
    // open map
    return [
      `${this.mapOpener}`,
      // loop over each element
      ...Object.entries(data)
        .filter(([metric]) => !!metric)
        .map(([metric, value], index) => {
          return this._buildMapData(metric, value, indent, index);
        }),
      // close map
      indentWith(this.mapCloser, indent),
    ].join('');
  }

  /**
   * Builds the body data of a map
   * @param {string} metric - colors, backgroundColor, etc
   * @param {object|string} value - the metric value, usually an object
   * @param {number} indent - the number of indents to apply
   * @param {number} metricIndex - the metric index it is in
   * @return {string|*}
   * @private
   */
  _buildMapData(metric, value, indent, metricIndex) {
    if (this._shouldContinueWalking(value)) {
      const nestLevel = indent / INDENT_BY;
      if (nestLevel <= this.flattenMapsAfter) {
        return this._buildObjectEntry(
          metric,
          this._buildMap(value, indent + INDENT_BY),
          indent,
          metricIndex,
        );
      }
      return this._walkRecursively(value, metric, indent, metricIndex).join('');
    }
    // not an object so we can directly build an entry
    return this._buildObjectEntry(metric, value, indent, metricIndex);
  }

  _walkRecursively(value, parentPropertyName, indent, metricIndex) {
    const isValueArray = Array.isArray(value);
    return Object.entries(value).reduce((all, [propertyName, propertyValue], index) => {
      const property = [parentPropertyName, isValueArray ? null : propertyName]
        .filter(Boolean)
        .join('-');
      const val = isObject(propertyValue)
        ? this._walkRecursively(propertyValue, property, indent, metricIndex)
        : this._buildObjectEntry(property, propertyValue, indent, index, metricIndex);

      return all.concat(val);
    }, []);
  }

  /**
   * Creates a single map entry
   * @param {string} key - the key of the entry. Usually concatenated prefixed string
   * @param {string | array} value - the value if the entry. Should be either array or a string
   * @param {number} indent - the number of indents
   * @param {number} index - the current item index
   * @param {number} metricIndex - the current metric's index
   * @return {string}
   * @private
   */
  _buildObjectEntry(key, value, indent) {
    return indentWith(
      `${this._objectEntryKeySanitizer(key)}: ${this._sanitizePropValue(value)},\n`,
      indent + INDENT_BY,
    );
  }

  /**
   * Sanitizes object keys
   * @param {string} key
   * @return {string}
   * @private
   */
  _objectEntryKeySanitizer(key) {
    key = sanitizeKey(key);
    return this.quotedKeys ? `"${key}"` : key;
  }

  /**
   * Checks whether a setting is enabled or not.
   * @param {string} key
   * @return {boolean}
   * @private
   */
  _isSettingEnabled(key) {
    if (this.onlyIncludeKeys.length) return this.onlyIncludeKeys.includes(key);
    const { corePlugins } = this.configs;
    if (this.preserveKeys.length && this.preserveKeys.includes(key)) return true;
    if (!corePlugins) return true;
    return Array.isArray(corePlugins) ? corePlugins.includes(key) : corePlugins[key] !== false;
  }

  _isFileSplitting() {
    return this.fileSplitting;
  }

  fileSplittingConfig() {
    return {
      layouts: ['aspectRatio', 'container', 'columns', 'zIndex', 'screens', 'supports'],
      grids: [
        'flex',
        'flexBasic',
        'flexGrow',
        'flexShrink',
        'gap',
        'gridAutoColumns',
        'gridAutoRows',
        'gridColumn',
        'gridColumnEnd',
        'gridColumnStart',
        'gridRow',
        'gridRowStart',
        'gridRowEnd',
        'gridTemplateColumns',
        'gridTemplateRows',
        'order',
      ],
      spacings: ['spacing', 'padding', 'margin', 'space'],
      sizing: ['width', 'minWidth', 'maxWidth', 'height', 'minHeight', 'maxHeight'],
      typographies: [
        'colors',
        'fontFamily',
        'letterSpacing',
        'lineHeight',
        'listStyleType',
        'textColor',
        'textDecorationColor',
        'textDecorationThickness',
        'textUnderlineOffset',
        'textIndent',
        'textOpacity',
      ],
      backgrounds: [
        'backgroundColor',
        'backgroundImage',
        'backgroundOpacity',
        'backgroundPosition',
        'backgroundSize',
        'gradientColorStops',
      ],
      borders: [
        'borderColor',
        'borderOpacity',
        'borderRadius',
        'borderWidth',
        'divideColor',
        'divideOpacity',
        'divideWidth',
        'outlineColor',
        'outlineOffset',
        'outlineWidth',
        'ringColor',
        'ringOffsetColor',
        'ringOffsetWidth',
        'ringOpacity',
        'ringWidth',
      ],
      effetcs: ['boxShadow', 'boxShadowColor', 'opacity'],
      filters: [
        'blur',
        'brightness',
        'contrast',
        'dropShadow',
        'grayscale',
        'invert',
        'saturate',
        'sepia',
        'backdropBlur',
        'backdropBrightness',
        'backdropContrast',
        'backdropGrayscale',
        'backdropHueRotate',
        'backdropInvert',
        'backdropOpacity',
        'backdropSaturate',
        'backdropSepia',
      ],
      tables: ['borderSpacing'],
      transitions: [
        'transitionDelay',
        'transitionDuration',
        'transitionProperty',
        'transitionTimingFunction',
      ],
      animations: ['animation', 'keyframes'],
      transforms: ['scale', 'rotate', 'translate', 'skew', 'transformOrigin'],
      interactivities: [
        'willChange',
        'caretColor',
        'accentColor',
        'cursor',
        'objectPosition',
        'scrollMargin',
        'scrollPadding',
      ],
      svgs: ['fill', 'stroke', 'strokeWidth'],
      others: ['aria', 'content', 'inset', 'placeholderColor', 'placeholderOpacity'],
    };
  }
}

module.exports = Converter;
