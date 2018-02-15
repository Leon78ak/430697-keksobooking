'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  /**
   * вспомогательная ф-я для задания случайного порядка сортировки массива
   * @return {number}   [description]
   */
  var compareRandom = function () {
    // Math.random() возвращает результат от 0 до 1. Вычтем 0.5, чтобы область значений стала [-0.5 ... 0.5)
    return Math.random() - 0.5;
  };

  window.util = {
    /**
    * возвращает случайное целое в диапазоне от min до max
    * @param  {number} min}
    * @param  {number} max
    * @return {number}
    */
    getRandomInteger: function (min, max) {
      var rand = min + Math.random() * (max + 1 - min);
      rand = Math.floor(rand);
      return rand;
    },
    /**
     * возвращает случайное значение из массива
     * @param  {array} array массив элементов
     * @return {[type]}       [description]
     */
    getRandomArrayValue: function (array) {
      return array[Math.floor(Math.random() * array.length)];
    },
    /**
     * забирает неповторяющееся случайное значение из переданного массива значений
     * @param {array} array - массив значений
     * @return {string}
     */
    getRandomUniqueArrayValue: function (array) {
      var randValue = Math.floor(Math.random() * array.length);
      return array.splice(randValue, 1);
    },
    /**
     * создает массив чисел-номеров пользователей
     * @param  {number} min
     * @param  {number} max
     * @return {array}
     */
    createArrayOfNumbers: function (min, max) {
      var array = [];
      for (var i = min; i <= max; i++) {
        array.push(i);
      }
      return array;
    },
    /**
     * сортирует массив значений в случайном порядке
     * @param  {array} array массив занчений
     * @return {array}       отсортированный массив
     */
    getShuffleArray: function (array) {
      // копируем исходный массив
      var arrayCopy = array.slice(0);
      // перетрясем исходный массив значений в случайном порядке
      // отсортируем исходный массив значений в случайном порядке
      return arrayCopy.sort(compareRandom);
    },
    /**
     * забирает случайное число случайных значений массива
     * @param  {array} array массив занчений
     * @return {array}       отсортированный массив
     */
    getRandomShuffleArray: function (array) {
      // копируем исходный массив
      var arrayCopy = array.slice(0);
      // генерим случайное число - максимальное значение индекса массива больше 0
      var randValue = Math.floor(1 + Math.random() * arrayCopy.length);
      // перетрясем исходный массив значений в случайном порядке
      // отсортируем исходный массив значений в случайном порядке
      return arrayCopy.sort(compareRandom).slice(0, randValue);
    },
    /**
     * проверяет наступление события при нажатии клавиши Esc
     * @param  {Object}  evt    объект события
     * @param  {Function} action функция действия при наступлении события
     */
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    /**
     * проверяет наступление события при нажатии клавиши Enter
     * @param  {Object}  evt    объект события
     * @param  {Function} action функция действия при наступлении события
     */
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    }
  };
})();
