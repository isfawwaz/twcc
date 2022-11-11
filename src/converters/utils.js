const twResolveConfig = require('tailwindcss/resolveConfig');

function indentWith(value, size) {
  return ' '.repeat(size) + value;
}
module.exports.indentWith = indentWith;

/**
 * Resolves a config.
 * If passed a string, imports it first.
 * @param {String | Object} config
 * @return {Object}
 */
function resolveConfig(config) {
  if (typeof config === 'string') {
    config = require(config);
  }
  return twResolveConfig(config);
}
module.exports.resolveConfig = resolveConfig;

function isObject(value) {
  return !Array.isArray(value) && typeof value === 'object';
}
module.exports.isObject = isObject;

function sanitizeKey(text) {
  // console.log({ text });
  return text.replace(/%/g, '').replace(/, /g, '-');
}
module.exports.sanitizeKey = sanitizeKey;

function camelToString(key, separator = '-') {
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.split(' ').join(separator).toLowerCase();
}
module.exports.camelToString = camelToString;

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key]?.includes(value));
}
module.exports.getKeyByValue = getKeyByValue;
