'use strict';

(function () {
  var TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var TYPES_OF_ACCOMODATION = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };
  var CHECK_TIMES = [
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
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
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

  var titles = TITLES.slice(0);
  var photos = PHOTOS.slice(0);

  /**
   * функция для создания массива объектов объявлений
   * @param  {number} usersNumb количество пользователей
   * @return {array.<Object>}
   */
  var createNotices = function (usersNumb) {
    var arrayUsersNumbers = window.util.createArrayOfNumbers(1, usersNumb);
    var notices = [];

    for (var i = 0; i < usersNumb; i++) {
      var x = window.util.getRandomInteger(MIN_X, MAX_X);
      var y = window.util.getRandomInteger(MIN_Y, MAX_Y);

      notices[i] = {
        author: {
          avatar: 'img/avatars/user0' + window.util.getRandomUniqueArrayValue(arrayUsersNumbers) + '.png',
        },

        offer: {
          title: window.util.getRandomUniqueArrayValue(titles),
          address: x + ', ' + y,
          price: window.util.getRandomInteger(PRICE_MIN, PRICE_MAX),
          type: TYPES_OF_ACCOMODATION[window.util.getRandomArrayValue(Object.keys(TYPES_OF_ACCOMODATION))],
          rooms: window.util.getRandomInteger(MIN_ROOMS, MAX_ROOMS),
          guests: window.util.getRandomInteger(MIN_GUESTS, MAX_GUESTS),
          checkin: window.util.getRandomArrayValue(CHECK_TIMES),
          checkout: window.util.getRandomArrayValue(CHECK_TIMES),
          features: window.util.getRandomShuffleArray(FEATURES),
          description: '',
          photos: window.util.getShuffleArray(photos)
        },

        location: {
          x: x,
          y: y
        }
      };
    }

    return notices;
  };

  window.data = createNotices(8);
})();
