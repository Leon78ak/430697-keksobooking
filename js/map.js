'use strict';

var TITLE = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

// ?? нужно ли производить копии исходных массивов: arr.slice(0) для последующей работы с ними??

TYPE_OF_ACCOMODATION = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var CHECK_TIME = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;

var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 100;
var MAX_Y = 500;

var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

/**
 * возвращает случайное целое
 * @param  {number} min
 * @param  {number} max
 * @return {number}
 */
getRandomInteger = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

/**
 * возвращает случайное значение из переданного массива значений
 * @param {array} array - массив значений
 * @return {}
 */
getRandomArrayValue = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};


/**
 * возвращает неповторяющееся случайное значение из переданного массива значений
 * @param {array} array - массив значений
 * @return {string}
 */
getRandomUniqueArrayValue =  function (array) {
  var randValue = Math.floor(Math.random() * array.length);
  return array.splice(randValue, 1);
};

/**
 * функция для создания массива объектов объявлений
 * @param  {number} usersNumb количество пользователей
 * @return {array}
 */
var createNotice = function (usersNumb) {
  var notices = [];
  var arrayUsersNumbers = createArrayOfNumbers(1, usersNumb);

  for (var i = 0; i < usersNumb; i++) {
    var x = getRandomInteger(MIN_X, MAX_X);
    var y = getRandomInteger(MIN_Y, MAX_Y);

    notices[i] = {
      author: {
        avatar: 'img/avatars/user0' + getRandomUniqueArrayValue(arrayUsersNumbers) + '.png',
      },

      offer: {
        title: getRandomUniqueArrayValue(TITLE),
        address: x + ', ' + y,
        price: getRandomInteger(PRICE_MIN, PRICE_MAX),
        type: getRandomArrayValue(Object.keys(TYPE_OF_ACCOMODATION)),
        rooms: getRandomInteger(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomInteger(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomArrayValue(CHECK_TIME),
        checkout: getRandomArrayValue(CHECK_TIME),
        features: getRandomArray(FEATURES),
        description: '',
        photos: []
      },

      location: {
        x: x,
        y: y
      }
    }
  }

  return notices;
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');
