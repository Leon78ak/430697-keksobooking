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

var title = TITLE.slice(0);

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

var features = FEATURES.slice(0);

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

var photos = PHOTOS.slice(0);

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
        title: getRandomUniqueArrayValue(title),
        address: x + ', ' + y,
        price: getRandomInteger(PRICE_MIN, PRICE_MAX),
        type: getRandomArrayValue(Object.keys(TYPE_OF_ACCOMODATION)),
        rooms: getRandomInteger(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomInteger(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomArrayValue(CHECK_TIME),
        checkout: getRandomArrayValue(CHECK_TIME),
        features: getRandomShuffleArray(features),
        description: '',
        photos: getShuffleArray(photos)
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
var mapFilters = map.querySelector('.map__filters-container');
map.classList.remove('map--faded');
var template = document.querySelector('template');
var similarPinTemplate = template.content.querySelector('.map__pin');
var imagePin = similarPinTemplate.querySelector('img');
var similarPinsList = map.querySelector('.map__pins');
var similarCardTemplate = template.content.querySelector('.map__card');

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

// На основе первого по порядку элемента из сгенерированного массива
//  и шаблона template article.map__card создайте DOM-элемент объявления,
//  заполните его данными из объекта и вставьте полученный DOM-элемент в блок .map
//  перед блоком .map__filters-container:
var renderCard = function (card) {
  var cardElement = similarCardTemplate.cloneNode(true);
  cardElement.querySelector('h3').textContent = card.offer.title;
  cardElement.querySelector('p small').textContent = card.offer.address;
  cardElement.querySelector('.popup__price').textContent = card.offer.price + ' \u20bd/ночь';
  cardElement.querySelector('h4').textContent = TYPE_OF_ACCOMODATION[card.offer.type];
  cardElement.querySelector('h4 + p').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
  var ulFeatures = cardElement.querySelector('.popup__features');
  ulFeatures.innerHTML = '';
  var cardFeatures = card.offer.features;
  cardFeatures.forEach(function (feature) {
    var featureElement = document.createElement('li');
    featureElement.classList.add('feature', 'feature--' + feature);
    ulFeatures.appendChild(featureElement);
  });
  cardElement.querySelector('ul + p').textContent = card.offer.description;
  cardElement.querySelector('.popup__avatar').src = card.author.avatar;

  // var ulPictures = cardElement.querySelector('.popup__pictures');
  // photos.forEach(function (photo) {
  //   var photoElement =
  // })
  // ulPictures.querySelector('img').src = card.offer.photos;
  return cardElement;
};

var fragmentCard = document.createDocumentFragment();
cards.forEach(function (card) {
  fragmentCard.appendChild(renderCard(card));
});

map.insertBefore(fragmentCard, mapFilters);
