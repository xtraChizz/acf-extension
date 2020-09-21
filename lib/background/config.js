"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _coreCommon = require("@dhruv-techapps/core-common");

var _coreExtension = require("@dhruv-techapps/core-extension");

class Config {
  processPortMessage({
    URL,
    frameElement
  }) {
    try {
      const data = _coreCommon.LocalStorage.getItem('configs');

      const sheets = _coreCommon.LocalStorage.getItem('sheets');

      for (const index in data) {
        const record = data[index];

        if (record && typeof record === 'object' && !Array.isArray(record)) {
          if (record.enable && record.url && (record.url === URL || new RegExp(this.escape(record.url)).test(URL) || URL.indexOf(record.url) !== -1)) {
            _coreExtension.BrowserAction.setIcon({
              path: 'assets/icons/icon64.png'
            });

            return Promise.resolve({
              record,
              sheets
            });
          }
        }
      }
    } catch (error) {
      _coreCommon.Logger.error(error);
    }

    if (!frameElement) {
      _coreExtension.BrowserAction.setIcon({
        path: 'assets/icons/icon64.png'
      });
    }

    _coreCommon.Logger.log(`No Records Found ${URL}`);

    return Promise.resolve();
  }

  escape(url) {
    return url.replace(/[?]/g, '\\$&');
  }

}

exports.default = Config;