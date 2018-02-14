'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

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

var titles = TITLES.slice(0);

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

var TYPE_TO_PRICE = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var photos = PHOTOS.slice(0);

var PIN_ARROW_HEIGHT = 16;

/**
 * возвращает случайное целое в диапазоне от min до max
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
 * забирает неповторяющееся случайное значение из переданного массива значений
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
 * забирает случайное число случайных значений массива
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
 * @return {array.<Object>}
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
        title: getRandomUniqueArrayValue(titles),
        address: x + ', ' + y,
        price: getRandomInteger(PRICE_MIN, PRICE_MAX),
        type: getRandomArrayValue(Object.keys(TYPES_OF_ACCOMODATION)),
        rooms: getRandomInteger(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomInteger(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomArrayValue(CHECK_TIMES),
        checkout: getRandomArrayValue(CHECK_TIMES),
        features: getRandomShuffleArray(FEATURES),
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

var data = createNotices(8);

var map = document.querySelector('.map');
var mapFilters = map.querySelector('.map__filters-container');
var template = document.querySelector('template');
var similarPinTemplate = template.content.querySelector('.map__pin');
var similarPinsList = map.querySelector('.map__pins');
var similarCardTemplate = template.content.querySelector('.map__card');

var pinOffset = {
  y: similarPinTemplate.offsetHeight + PIN_ARROW_HEIGHT
};

/**
 * получает элемент метка из шаблона
 * @param  {Object} pin объект данных
 * @return {Element}
 */
var getPinFromTemplate = function (pin) {
  var pinElement = similarPinTemplate.cloneNode(true);
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.style = 'left: ' + (pin.location.x) + 'px; top:' + (pin.location.y + pinOffset.y) + 'px;';
  // pinElement.setAttribute('id', ;
  // console.log(pinElement.id);
  return pinElement;
};

/**
 * отрисовывает метку
 * @param {array.<Object>} pins
 * @return {[type]}      [description]
 */
var renderPin = function (pins) {
  var fragmentPin = document.createDocumentFragment();
  pins.forEach(function (pin) {
    fragmentPin.appendChild(getPinFromTemplate(pin));
  });
  return fragmentPin;
};

similarPinsList.appendChild(renderPin(data));

/**
 * получает элемент из шаблона
 * @param  {Object} card объект данных
 * @return {Element}
 */
var getCardFromTemplate = function (card) {
  var cardElement = similarCardTemplate.cloneNode(true);
  cardElement.querySelector('h3').textContent = card.offer.title;
  cardElement.querySelector('p small').textContent = card.offer.address;
  cardElement.querySelector('.popup__price').textContent = card.offer.price + ' \u20bd/ночь';
  cardElement.querySelector('h4').textContent = TYPES_OF_ACCOMODATION[card.offer.type];
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

  var ulPictures = cardElement.querySelector('.popup__pictures');
  ulPictures.innerHTML = '';
  var cardPhotos = card.offer.photos;
  cardPhotos.forEach(function (photo) {
    var photoElement = document.createElement('li');
    var urlPhotoElement = document.createElement('img');
    urlPhotoElement.src = photo;
    urlPhotoElement.width = '70';
    urlPhotoElement.height = '70';
    photoElement.appendChild(urlPhotoElement);
    ulPictures.appendChild(photoElement);
  });

  return cardElement;
};

/**
 * отрисовывавет карточку на страницу
 * @param  {array.<Object>} объект с данными из массива
 * @return {Element} фрагмент для вставки
 */
var renderCard = function (card) {
  var fragmentCard = document.createDocumentFragment();
  fragmentCard.appendChild(getCardFromTemplate(card));

  return fragmentCard;
};

// module4

var mapPinMain = map.querySelector('.map__pin--main');
var mapPin = map.querySelectorAll('.map__pin');
var pinsContainer = map.querySelector('.map__pins');
var noticeForm = document.querySelector('.notice__form');
var addressField = noticeForm.querySelector('#address');

// координаты главной метки по умолчанию
var initAddressCoords = {
  x: Math.floor(mapPinMain.offsetTop + mapPinMain.offsetHeight / 2 + PIN_ARROW_HEIGHT),
  y: Math.floor(map.offsetWidth / 2)
};

/**
 * деактивация страницы
 */
var deactivatePage = function () {
  // устанавливаем значения адресного поля по умолчанию
  addressField.value = 'x: ' + initAddressCoords.x + ' y: ' + initAddressCoords.y;

  // скроем метки похожих объявлений
  for (var i = 0; i < mapPin.length; i++) {
    if (!mapPin[i].classList.contains('map__pin--main')) {
      mapPin[i].classList.add('hidden');
    }
  }
};

deactivatePage();

/**
 * активирует форму на странице
 */
var initForm = function () {
  noticeForm.classList.remove('notice__form--disabled');
  for (var i = 0; i < noticeForm.children.length; i++) {
    if (noticeForm.children[i].nodeType === 1) {
      noticeForm.children[i].disabled = false;
    }
  }
  // опции количества мест кроме значения '1 комната' делаем недоступными
  Array.from(capacitys).filter(function (capacity) {
    if (capacity.value === '1') {
      capacity.disabled = false;
    } else {
      capacity.disabled = true;
    }
  });
};

/**
 * показывает метки на карте при инициализации страницы
 */
var showPins = function () {
  for (var i = 0; i < mapPin.length; i++) {
    if (mapPin[i].classList.contains('hidden')) {
      mapPin[i].classList.remove('hidden');
    }
  }
};

/**
 * активирует страницу
 */
var initPage = function () {
  map.classList.remove('map--faded');

  initForm();

  showPins();
};

/**
 * обработчик события при отпускании мыши на главной метке страницы
 * @param  {Object} evt
 */
var onMainPinMouseUp = function () {
  initPage();

  // вызов метода, который устанавливает значения поля ввода адреса?
};

mapPinMain.addEventListener('mouseup', onMainPinMouseUp);

/**
 * проверяет наступление события при нажатии клавиши Esc
 * @param  {Object}  evt    объект события
 * @param  {Function} action функция действия при наступлении события
 */
var isEscEvent = function (evt, action) {
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
};

/**
 * проверяет наступление события при нажатии клавиши Enter
 * @param  {Object}  evt    объект события
 * @param  {Function} action функция действия при наступлении события
 */
var isEnterEvent = function (evt, action) {
  if (evt.keyCode === ENTER_KEYCODE) {
    action();
  }
};

var activePin = null;
/**
  * обработчик события клика на метке
  * @param  {Element}  node метка с событием
  */
var onPinClick = function (node) {
  // Если до этого у другого элемента существовал класс pin--active, то у этого элемента класс нужно убрать
  if (activePin) {
    activePin.classList.remove('map__pin--active');
    closePopup();
  }

  activePin = node;
  activePin.classList.add('map__pin--active');

  openPopup();
};

/**
 * показывает попап при клике на метке
 */
var openPopup = function () {
  var index = Array.from(mapPin).indexOf(activePin);

  map.insertBefore(renderCard(data[index - 1]), mapFilters);
};

/**
 * скрывает попап
 */
var closePopup = function () {
  for (var i = 0; i < map.children.length; i++) {
    if (map.children[i].classList.contains('popup')) {
      var activePopup = map.children[i];
      map.removeChild(activePopup);

      activePin.classList.remove('map__pin--active');
      return;
    }
  }
};

// делегируем обработку клика на пине на блок .map__pins
pinsContainer.addEventListener('click', function (evt) {
  var target = evt.target;
  while (target !== pinsContainer) {
    if (target.className === 'map__pin') {
      onPinClick(target);

      document.addEventListener('keydown', function (evtKeydown) {
        isEscEvent(evtKeydown, closePopup);
      });
      return;
    }
    target = target.parentNode;
  }
});

/**
 * обработчик при нажатии enter на кнопке закрытия попапа
 * @param  {[type]} evt [description]
 */
var onPopupKeydownPress = function (evt) {
  var target = evt.target;

  if (target && target.className === 'popup__close') {
    isEnterEvent(evt, closePopup);
  }
};

/**
 * обработчик при клике на кнопке закрытия попапа
 * @param  {[type]} evt [description]
 */
var onPopupClick = function (evt) {
  var target = evt.target;

  if (target && target.className === 'popup__close') {
    closePopup();
  }
};

// //закрытие попапа при клике на крестике
map.addEventListener('click', onPopupClick);
map.addEventListener('keydown', onPopupKeydownPress, true);

var titleField = noticeForm.querySelector('#title');
var timeIn = noticeForm.querySelector('#timein');
var timeOut = noticeForm.querySelector('#timeout');
var typeOfAccomodation = noticeForm.querySelector('#type');
var price = noticeForm.querySelector('#price');
var roomNumber = noticeForm.querySelector('#room_number');
var capacity = noticeForm.querySelector('#capacity');
var capacitys = capacity.options;

timeIn.addEventListener('change', function (evt) {
  timeOut.value = evt.target.value;
});

timeOut.addEventListener('change', function (evt) {
  timeIn.value = evt.target.value;
});

/**
 * синхронизирует тип жилья с минимальной ценой
 */
var syncPrice = function () {
  var selectedField = typeOfAccomodation.value;
  price.min = TYPE_TO_PRICE[selectedField];
};

typeOfAccomodation.addEventListener('change', syncPrice);

// соответствие value комнат количеству гостей
var ROOMS_TO_CAPACITY = {
  '1': '1',
  '2': '2',
  '3': '3',
  '100': '0'
};

/**
 * синхронизирует значение поля выбора комнат со значением поля количества гостей
 * @return {string} значение поля выбора количества гостей
 */
var syncRooms = function () {
  var roomNumbers = roomNumber.value;
  var capacityValue = ROOMS_TO_CAPACITY[roomNumbers];

  return capacityValue;
};

// значения для создания новых элементов выбора гостей
var CAPACITY_VALUE_TEXT = {
  1: 'для 1 гостя',
  2: 'для 2 гостей',
  3: 'для 3 гостей',
  0: 'не для гостей'
};

/**
 * создает новые опции для селекта
 * @param  {string} val    значение опции
 * @param  {string} txt    текстовое значение
 * @param  {Element} select селект
 */
var createNewOption = function (val, txt, select) {
  var newOption = document.createElement('OPTION');
  newOption.value = val;
  newOption.text = txt;
  select.add(newOption);
};

/**
 * синхронизирует поля выбора комнат с количеством гостей
 */
var roomNumberSync = function () {
  var selectedValue = syncRooms();
  capacity.length = 0;
  for (var value in CAPACITY_VALUE_TEXT) {
    if (CAPACITY_VALUE_TEXT.hasOwnProperty(value)) {
      if (value <= selectedValue && value !== '0') {
        createNewOption(value, CAPACITY_VALUE_TEXT[value], capacity);
      }
      if (selectedValue === '0') {
        createNewOption(value, CAPACITY_VALUE_TEXT[value], capacity);

        return;
      }
    }
  }
};

roomNumber.addEventListener('change', roomNumberSync);

/**
 * валидация формы
 * @param  {Element} input поле формы для валидации
 */
var validateInput = function (input) {
  if (input.validity.tooShort) {
    input.setCustomValidity('Заголовок должен состоять минимум из ' + input.getAttribute('minlength') + ' символов');
  } else if (input.validity.tooLong) {
    input.setCustomValidity('Заголовок должен состоять максимум из ' + input.getAttribute('maxlength') + ' символов');
  } else if (input.validity.valueMissing) {
    input.setCustomValidity('Обязательное поле');
  } else if (input.validity.rangeUnderflow) {
    input.setCustomValidity('Минимальное значение цены ' + input.getAttribute('min'));
  } else if (input.validity.tooLong) {
    input.setCustomValidity('Максимальное значение цены ' + input.getAttribute('max'));
  } else {
    input.setCustomValidity('');
  }
};

titleField.addEventListener('invalid', function () {
  validateInput(titleField);
});

price.addEventListener('invalid', function () {
  validateInput(price);
});
