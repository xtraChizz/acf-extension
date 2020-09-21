"use strict";

var _coreCommon = require("@dhruv-techapps/core-common");

var _acfCommon = require("@dhruv-techapps/acf-common");

var _coreExtension = require("@dhruv-techapps/core-extension");

var _config = _interopRequireDefault(require("./config"));

var _constant = require("../common/constant");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-new */
(() => {
  const {
    name,
    'config.uninstall_url': uninstallUrl,
    'config.tracking_id': trackingId,
    'config.options_page_url': optionsPageUrl
  } = _coreExtension.Manifest.values(['name', 'config.uninstall_url', 'config.tracking_id', 'config.options_page_url']);
  /**
  * Browser Action set to open option page / configuration page
  */


  _coreExtension.BrowserAction.onClicked(() => {
    new _coreExtension.Tabs({
      url: optionsPageUrl
    });
  });
  /**
  * If an update is available it will auto update
  */


  _coreExtension.Runtime.onUpdateAvailable(_coreExtension.Runtime.reload);
  /**
  * Set Context Menu for right click
  */


  new _coreExtension.ContextMenus({
    id: _constant.CONTEXT_MENU_ID,
    title: String(name)
  }).onClicked(({
    menuItemId
  }) => {
    if (menuItemId === _constant.CONTEXT_MENU_ID) {
      new _coreExtension.Tabs({
        xpath: _coreCommon.LocalStorage.getItem(_acfCommon.LOCAL_STORAGE_KEY.XPATH),
        url: _coreCommon.LocalStorage.getItem(_acfCommon.LOCAL_STORAGE_KEY.URL)
      });

      _coreCommon.LocalStorage.removeItem(_acfCommon.LOCAL_STORAGE_KEY.XPATH);

      _coreCommon.LocalStorage.removeItem(_acfCommon.LOCAL_STORAGE_KEY.URL);
    }
  });
  /**
  * On initial install setup basic configuration
  */

  _coreExtension.Runtime.onInstalled(() => {
    if (!_coreCommon.LocalStorage.getItem(_acfCommon.LOCAL_STORAGE_KEY.INSTALL_DATE, null)) {
      _coreCommon.LocalStorage.setItem(_acfCommon.LOCAL_STORAGE_KEY.INSTALL_DATE, _coreCommon.DateUtil.getDateWithoutTime().toJSON());

      new _coreExtension.Tabs({
        url: optionsPageUrl
      });
    }
  });
  /**
  * On start up check for rate
  */
  // Runtime.onStartup(() => new Rate('', 5))

  /**
  * setup Google Analytics
  */


  window.ga = new _coreExtension.GoogleAnalytics(trackingId);
  /**
  * Setup Unintall action
  */

  _coreExtension.Runtime.setUninstallURL(uninstallUrl);
  /**
  * Setting up port to listen between content_script and popup
  */


  _coreExtension.Runtime.onMessageExternal({
    [_config.default.name]: new _config.default()
  });

  _coreExtension.Runtime.onMessage({
    [_config.default.name]: new _config.default()
  });
})();