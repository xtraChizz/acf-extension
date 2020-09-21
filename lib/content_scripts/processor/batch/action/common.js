"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _coreCommon = require("@dhruv-techapps/core-common");

var _acfCommon = require("@dhruv-techapps/acf-common");

var _configError = _interopRequireDefault(require("../../../error/config-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global chrome */
class Common {
  constructor(xpath) {
    this._settings = _coreCommon.DataStore.getInst().getItem(_acfCommon.LOCAL_STORAGE_KEY.SETTINGS);

    this._setNodes(xpath);

    if (this._nodes.snapshotLength === 0) {
      this._checkIframe(xpath);
    }

    if (this._nodes.snapshotLength === 0) {
      this._checkRetryOption(xpath);
    }
  }

  static async sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
  }

  static async wait(initWait) {
    if (initWait) {
      if (/\d+e\d+/.test(initWait.toString())) {
        const range = initWait.toString().split('e');
        await Common.sleep(Math.floor(Math.random() * 1000 * parseInt(range[1])) + parseInt(range[0]) * 1000);
      } else {
        await Common.sleep(Number(initWait) * 1000);
      }
    }
  }

  _setNodes(xpath) {
    try {
      const nodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

      if (nodes.snapshotLength === 0) {
        this.retryFunc(xpath);
      } else {
        this._nodes = nodes;
      }
    } catch (error) {
      throw new _configError.default(xpath);
    }
  }

  async retryFunc(xpath) {
    if (this._settings.retry > 0) {
      this._settings.retry--;

      if (this._settings.retryInterval !== 0) {
        await sleep(this._settings.retryInterval);
      }

      this._setNodes(xpath);
    }
  }

  _checkIframe(xpath) {
    const iframes = document.getElementsByTagName('iframe');

    for (let index = 0; index < iframes.length; index++) {
      if (this._nodes.snapshotLength !== 0) {
        break;
      }

      const contentDocument = iframes[index].contentDocument;

      if (contentDocument) {
        this._nodes = document.evaluate(xpath, contentDocument, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      } else {
        throw new Error('contentDocument is null for iframe');
      }
    }
  }

  _checkRetryOption(xpath) {
    if (this._settings.retryOption === _acfCommon.RETRY_OPTIONS.SKIP) {
      return 'Action skipped!';
    } else if (this._settings.retryOption === _acfCommon.RETRY_OPTIONS.RELOAD) {
      if (document.readyState === 'complete') {
        location.reload();
      } else {
        window.addEventListener('load', function () {
          location.reload();
        });
      }
    }

    throw new _configError.default(xpath);
  }

  notify(error, title, query) {
    chrome.runtime.sendMessage({
      action: _coreCommon.RUNTIME_MESSAGE.NOTIFICATIONS,
      notificationOptions: {
        title: title || 'Error',
        message: error,
        requireInteraction: true
      },
      extras: {
        options_page: true,
        query: query
      }
    });
  }

}

exports.default = Common;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}