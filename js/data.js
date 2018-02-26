'use strict';

(function () {

  /**
   * граничные значения диапазона координат
   * @enum {number}
   */
  var Coords = {
    MIN_X: 300,
    MAX_X: 900,
    MIN_Y: 150,
    MAX_Y: 500
  };

  /**
   * данные, загруженные с сервера
   * @type {Array.<Object>}
   */
  var data = null;

  window.data = {
    notices: data,
    coords: Coords
  };
})();
