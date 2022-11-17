const Converter = require('./converter');

class SassConverter extends Converter {
  format = 'sass';
  prefixContent = '';
  suffixContent = '';

  _buildVar(name, value) {
    return `$${name}: ${value};\n`;
  }

  _isPropertyConvertToString() {
    return true;
  }

  _convertObjectToMap(prop, data) {
    return this._convertObjectToVar(prop, data);
  }

  _sanitizePropValue(value) {
    if (Array.isArray(value)) return value.join(', ');
    return value;
  }
}

module.exports = SassConverter;
