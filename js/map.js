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

var TYPE_OF_ACCOMODATION = {
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

var PIN_HEIGHT = 22;

/**
 * возвращает случайное целое
 * @param  {number} min
 * @param  {number} max
 * @return {number}
 */
var getRandomInteger = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

/**
 * возвращает случайное значение из массива
 * @param  {array} array массив элементов
 * @return {[type]}       [description]
 */
var getRandomArrayValue = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * возвращает неповторяющееся случайное значение из переданного массива значений
 * @param {array} array - массив значений
 * @return {string}
 */
var getRandomUniqueArrayValue = function (array) {
  var randValue = Math.floor(Math.random() * array.length);
  return array.splice(randValue, 1);
};

/**
 * создает массив чисел-номеров пользователей
 * @param  {number} min
 * @param  {number} max
 * @return {array}
 */
var createArrayOfNumbers = function (min, max) {
  var array = [];
  for (var i = min; i <= max; i++) {
    array.push(i);
  }
  return array;
};

/**
 * вспомогательная ф-я для задания случайного порядка сортировки массива
 * @return {number}   [description]
 */
var compareRandom = function () {
  // Math.random() возвращает результат от 0 до 1. Вычтем 0.5, чтобы область значений стала [-0.5 ... 0.5)
  return Math.random() - 0.5;
};

/**
 * сортирует массив значений в случайном порядке
 * @param  {array} array массив занчений
 * @return {array}       отсортированный массив
 */
var getShuffleArray = function (array) {
  // копируем исходный массив
  var arrayCopy = array.slice(0);
  // перетрясем исходный массив значений в случайном порядке
  // отсортируем исходный массив значений в случайном порядке
  return arrayCopy.sort(compareRandom);
};

/**
 * выбирает случайное число случайных значений массива
 * @param  {array} array массив занчений
 * @return {array}       отсортированный массив
 */
var getRandomShuffleArray = function (array) {
  // копируем исходный массив
  var arrayCopy = array.slice(0);
  // генерим случайное число - максимальное значение индекса массива больше 0
  var randValue = Math.floor(1 + Math.random() * arrayCopy.length);
  // перетрясем исходный массив значений в случайном порядке
  // отсортируем исходный массив значений в случайном порядке
  return arrayCopy.sort(compareRandom).slice(0, randValue);
};

/**
 * функция для создания массива объектов объявлений
 * @param  {number} usersNumb количество пользователей
 * @return {array}
 */
var createNotices = function (usersNumb) {
  var arrayUsersNumbers = createArrayOfNumbers(1, usersNumb);
  var notices = [];

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
        type: getRandomArrayValue(TYPE_OF_ACCOMODATION),
        rooms: getRandomInteger(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomInteger(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomArrayValue(CHECK_TIME),
        checkout: getRandomArrayValue(CHECK_TIME),
        features: getRandomShuffleArray(FEATURES),
        description: '',
        photos: getShuffleArray(PHOTOS)
      },

      location: {
        x: x,
        y: y
      }
    };
  }

  return notices;
};

var cards = createNotices(8);

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var template = document.querySelector('template');
var similarPinTemplate = template.content.querySelector('.map__pin');
var imagePin = similarPinTemplate.querySelector('img');
var similarPinsList = map.querySelector('.map__pins');

var pinOffset = {
  x: imagePin.height + PIN_HEIGHT,
  y: imagePin.width / 2
};

var renderPin = function (pin) {
  var pinElement = similarPinTemplate.cloneNode(true);
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.style = 'left: ' + (pin.location.x + pinOffset.x) + 'px; top:' + (pin.location.y + pinOffset.y) + 'px;';

  return pinElement;
};

var fragmentPin = document.createDocumentFragment();
for (var i = 0; i < cards.length; i++) {
  fragmentPin.appendChild(renderPin(cards[i]));
}
similarPinsList.appendChild(fragmentPin);

