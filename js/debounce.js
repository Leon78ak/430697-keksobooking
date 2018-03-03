'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;

  /**
   * Устраняет дребезг от частых событий
   * @param {function} callback
   */
  window.debounce = function (callback) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(callback, DEBOUNCE_INTERVAL);
  };
})();
