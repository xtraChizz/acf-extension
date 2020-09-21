"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DATA_STORE_SETTINGS = void 0;

var _acfCommon = require("@dhruv-techapps/acf-common");

var _coreCommon = require("@dhruv-techapps/core-common");

var _error = require("./common/error");

var _config = require("./config");

var _context_menu = require("./context_menu");

var _systemError = _interopRequireDefault(require("./error/system-error"));

var _configError = _interopRequireDefault(require("./error/config-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DATA_STORE_SETTINGS = 'settings';
exports.DATA_STORE_SETTINGS = DATA_STORE_SETTINGS;
document.addEventListener('DOMContentLoaded', function () {
  loadSettings(_acfCommon.LOAD_TYPES.DOCUMENT);
});
window.addEventListener('load', function () {
  loadSettings(_acfCommon.LOAD_TYPES.WINDOW);
});
console.log(_coreCommon.LOCAL_STORAGE_TYPE);

function loadSettings(loadType) {
  try {
    const request = {
      action: _coreCommon.RUNTIME_MESSAGE.LOCAL_STORAGE,
      type: _coreCommon.LOCAL_STORAGE_TYPE.GET,
      key: _acfCommon.LOCAL_STORAGE_KEY.SETTINGS,
      fallback: _acfCommon.defaultSetting
    };
    chrome.runtime.sendMessage(request, setting => {
      console.log(setting);

      _coreCommon.DataStore.getInst().setItem(DATA_STORE_SETTINGS, setting);

      if (setting.loadType === loadType) {
        (0, _config.getConfig)();
      }
    });
  } catch (e) {
    if (e instanceof _systemError.default) {
      (0, _error.onError)(e);
    } else if (e instanceof _configError.default) {
      console.error(e.name + ': ' + e.message);
    } else {
      console.error(e.name + ': ' + e.message);
    }
  }
}

new _context_menu.ContextMenuSetup();