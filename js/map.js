'use strict';

(function () {

  /**
   * граничные значения диапазона координат на карте
   * @enum {number}
   */
  var Coords = {
    MIN_X: 300,
    MAX_X: 900,
    MIN_Y: 150,
    MAX_Y: 500
  };

  var OFFERS_LENGTH = 5;

  var map = document.querySelector('.map');
  var similarPinsList = map.querySelector('.map__pins');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var mapFilters = map.querySelector('.map__filters');
  var typeFilter = mapFilters.querySelector('#housing-type');
  var priceFilter = mapFilters.querySelector('#housing-price');
  var roomsFilter = mapFilters.querySelector('#housing-rooms');
  var guestsFilter = mapFilters.querySelector('#housing-guests');
  var mapPinMain = map.querySelector('.map__pin--main');
  var pinsContainer = map.querySelector('.map__pins');
  var noticeForm = document.querySelector('.notice__form');
  var formFieldsets = noticeForm.querySelectorAll('fieldset');
  var addressField = noticeForm.querySelector('#address');
  var capacity = noticeForm.querySelector('#capacity');
  var capacitys = capacity.options;

  // координаты главной метки по умолчанию
  var initAddressCoords = {
    y: Math.floor(map.offsetHeight / 2 + mapPinMain.offsetHeight / 2 + window.PIN_ARROW_HEIGHT),
    x: Math.floor(map.offsetWidth / 2)
  };

  /**
   * выводит координаты главной метки в поле адреса
   * @param  {Object} obj объект с координатами метки
   * @return {string}     значение в поле адреса
   */
  var getAddressCoords = function (obj) {
    addressField.value = 'x: ' + obj.x + ' y: ' + obj.y;
    return addressField.value;
  };

  /**
   * активирует форму на странице
   */
  var initForm = function () {
    noticeForm.classList.remove('notice__form--disabled');
    Array.from(formFieldsets).forEach(function (fieldset) {
      fieldset.disabled = false;
    });
    Array.from(mapFilters).forEach(function (filter) {
      filter.disabled = false;
    });
    // удаляем из разметки выбора количества мест все доступные опции
    // кроме выбранной по умолчанию
    Array.from(capacitys).filter(function (option) {
      if (option.value !== '1') {
        option.remove();
      }
    });
    // синхронизируем минимальное значение поля цены с типом жилья по умолчанию
    window.syncPrice();
  };

  /**
   * дизеблит форму и поля формы
   */
  var disableForm = function () {
    noticeForm.classList.add('notice__form--disabled');
    Array.from(formFieldsets).forEach(function (fieldset) {
      fieldset.disabled = true;
    });
    Array.from(mapFilters).forEach(function (filter) {
      filter.disabled = true;
    });
  };

  /**
   * показывает метки на карте при инициализации страницы
   * @param  {Array.<Object>} data массив объектов с данными
   */
  var showPins = function (data) {
    // копируем 5 данных из массива
    var pins = newData.slice(0, OFFERS_LENGTH);
    // var pins = window.util.getShuffleArray(newData).slice(0, OFFERS_LENGTH);
    // console.log(pins)
    similarPinsList.appendChild(window.renderPins(pins));
  };

  /**
   * инициализируем переменную для хранения данных с сервера
   * @type {Array.<?Object>}
   */
   var newData = [];

  /**
   * функция-коллбэк возвращает массив данных в случае успеха
   * @param  {Array.<Object>} data массив данных
   * @return {Array.<Object>}      записываем полученные данные
   */
  var onSuccess = function (data) {
    debugger;
    data.filter(function (it) {
      if (it.author.avatar !== "img/avatars/default.png")  {
        newData.push(it);
      };
    });

    showPins(newData);
  };

  /**
   * функция обратного вызова, которая срабатывает при неуспешном выполнении запроса:
   * выводит окно с сообщением об ошибке
   * @param  {string} error сообщение об ошибке
   */
  var onError = function (error) {
    var errorMessage = document.createElement('div');
    errorMessage.classList.add('error');
    errorMessage.textContent = error;
    document.body.appendChild(errorMessage);

    setTimeout(function() {
        document.body.removeChild(errorMessage);
        deactivatePage();
      }, 15000);
  };

  /**
   * функция активации страницы
   * @param  {Function} callback передаем коллбэк из модуля работы с сервером
   */
  var initPage = function (callback) {
    map.classList.remove('map--faded');
    initForm();
    callback(onSuccess, onError);
  };

  var activePin = null;
  /**
   * запускает логику событий при клике на пине
   * @param  {Element}  node метка с событием
   */
  var isPinClick = function (node) {
    debugger;
    // Если до этого у другого элемента существовал класс pin--active, то у этого элемента класс нужно убрать
    if (activePin) {
      activePin.classList.remove('map__pin--active');
      closePopup();
    }

    activePin = node;
    activePin.classList.add('map__pin--active');

    openPopup(newData);
  };

  /**
   * возвращает значение src изображения на активной метке
   * @param  {Element} activePin активная метка
   * @return {string}           значение src активной метки
   */
  var getSrcOnActivePin = function (activePin) {
    var img = activePin.querySelector('img');

    return img.getAttribute('src');
  };

  /**
   * показывает попап
   * @return {[type]} [description]
   */
  var openPopup = function (data) {
    var image = getSrcOnActivePin(activePin);
    var item = window.renderCard(data.filter(function (item) {
      if (item.author.avatar === image) {
        return item;
      }
    })[0]);

    var fragmentCard = document.createDocumentFragment();
    fragmentCard.appendChild(item);

    map.insertBefore(fragmentCard, mapFiltersContainer);
  };

  /**
   * скрывает попап
   */
  var closePopup = function () {
    var popup = map.querySelector('.popup');
    if (popup) {
      map.removeChild(popup);
      activePin.classList.remove('map__pin--active');
      activePin = null;
    }
  };

  // делегируем обработку клика на пине на блок .map__pins
  pinsContainer.addEventListener('click', function (evt) {

    var target = evt.target;
    while (target !== pinsContainer) {
      if (target.className === 'map__pin') {
        isPinClick(target);

        document.addEventListener('keydown', function (evtKeydown) {
          window.util.isEscEvent(evtKeydown, closePopup);
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
      window.util.isEnterEvent(evt, closePopup);
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

  // закрытие попапа при клике на крестике
  map.addEventListener('click', onPopupClick);
  map.addEventListener('keydown', onPopupKeydownPress, true);

  var removePins = function () {
    // скроем метки похожих объявлений
    var mapPin = map.querySelectorAll('.map__pin');
    Array.from(mapPin).forEach(function (pin) {
      if (!pin.classList.contains('map__pin--main')) {
        pin.remove();
      }
    });
  };
  var activePage = null;
  /**
   * деактивация страницы
   */
  var deactivatePage = function () {
    activePage = false;
    // устанавливаем значения адресного поля по умолчанию
    getAddressCoords(initAddressCoords);

    closePopup();

    removePins();

    disableForm();

    map.classList.add('map--faded');


    // сброс значений положения главной метки в исходную позицию
    mapPinMain.style.top = '';
    mapPinMain.style.left = '';
  };

  deactivatePage();

  // перемещение главной метки
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    /**
     * Обработчик событий на главном пине при движении
     * @param  {Object} moveEvt объект событий
     */
    var onMainPinMouseMove = function (moveEvt) {

      moveEvt.preventDefault();

      // смещение пина при движении
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      // обновляем стартовые координаты пина
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      // координаты для задания позиции пина
      var newY = mapPinMain.offsetTop - shift.y;
      var newX = mapPinMain.offsetLeft - shift.x;

      // обработка выноса за верхнюю границу положения на карте
      if (newY < Coords.MIN_Y) {
        newY = Coords.MIN_Y;
      }

      // вынос за нижнюю границу окна
      // новая нижняя граница элемента
      var newBottom = newY + mapPinMain.offsetHeight / 2 + window.PIN_ARROW_HEIGHT;

      if (newBottom > Coords.MAX_Y) {
        newY = Coords.MAX_Y - (mapPinMain.offsetHeight / 2 + window.PIN_ARROW_HEIGHT);
      }

      // вынос за левую границу окна
      if (newX < 0 + mapPinMain.offsetWidth / 2) {
        newX = 0 + mapPinMain.offsetWidth / 2;
      }

      // вынос за правую границу окна
      if (newX > map.clientWidth - mapPinMain.offsetWidth / 2) {
        newX = map.clientWidth - mapPinMain.offsetWidth / 2;
      }

      mapPinMain.style.top = newY + 'px';
      mapPinMain.style.left = newX + 'px';

      // новые координаты главной метки для адресного поля
      var newAddressCoords = {
        y: Math.floor(mapPinMain.offsetTop + mapPinMain.offsetHeight / 2 + window.PIN_ARROW_HEIGHT),
        x: Math.floor(mapPinMain.offsetLeft)
      };

      getAddressCoords(newAddressCoords);
    };

    /**
     * обработчик событий на главной метке при отпускании клавиши мыши
     * удаляет обработчики, запускает функцию активации страницы
     * @param  {Object} upEvt Объект событий
     */
    var onMainPinMouseUp = function (upEvt) {
      debugger;
      upEvt.preventDefault();

      if (!activePage) {
        initPage(window.backend.load);
      }
      activePage = true;

      document.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
    };

    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  });

  window.map = {
    deactivatePage: deactivatePage,
    onError: onError
  };





  /**
   * обновляет пины в соответствии с выбранными фильтрами
   * @param  {[type]} type     [description]
   * @param  {[type]} guests   [description]
   * @param  {[type]} price    [description]
   * @param  {[type]} rooms    [description]
   * @param  {[type]} features [description]
   * @return {[type]}          [description]
   */
  var updatePins =  function (type, guests, price, rooms, features) {
    closePopup();
    removePins();

    var newNotices = [];
    debugger;
    if (type !== 'any') {
      newNotices = newData.filter(function (it) {
        return it.offer.type === type;
      });
      console.log(newNotices);
    }
    if (guests !== 'any') {
      newNotices = newData.filter(function (it) {
        return it.offer.guests === (+guests);
      });
    }
    if (rooms !== 'any') {
      newNotices = newData.filter(function (it) {
        return it.offer.rooms === (+rooms);
      });
    }
    if (price !== 'any') {
      if (price === 'low') {
        newNotices = newData.filter(function (it) {
          return it.offer.price < 10000;
        });
      } else if (price === 'high') {
        newNotices = newData.filter(function (it) {
          return it.offer.price > 50000;
        });
      } else if (price === 'middle') {
        newNotices = newData.filter(function (it) {
          return (it.offer.price >= 10000 && it.offer.price <= 50000);
        });
      }
    }
    features.forEach(function (feature) {
      newNotices = newData.filter(function (it) {
          return it.offer.features.includes(feature.value);
        });
    });

    similarPinsList.appendChild(window.renderPins(newNotices));
    }

  mapFilters.addEventListener('change', function () {
    var type = typeFilter.value;
    var guests = guestsFilter.value;
    var price = priceFilter.value;
    var rooms = roomsFilter.value;
    var featuresFilter = mapFilters.querySelector('#housing-features').querySelectorAll('input[type=checkbox]:checked');

    var features = Array.from(featuresFilter).filter(function (it) {
        return it.value;
    });

    updatePins(type, guests, price, rooms, features);
  });
})();
