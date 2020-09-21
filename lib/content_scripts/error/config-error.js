"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _customError = _interopRequireDefault(require("./custom-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ConfigError extends _customError.default {
  constructor(title, ...params) {
    super(title, ...params);
    this.name = 'ConfigError';
  }

}

exports.default = ConfigError;