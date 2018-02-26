'use strict';

(function () {
  var map = document.querySelector('.map');
  var similarPinsList = map.querySelector('.map__pins');
  var mapFilters = map.querySelector('.map__filters-container');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPin = map.querySelectorAll('.map__pin');
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
  };

  /**
   * показывает метки на карте при инициализации страницы
   * @param  {Array.<Object>} data массив объектов с данными
   */
  var showPins = function (data) {
    similarPinsList.appendChild(renderPin(data));
  };

  /**
   * функция-коллбэк возвращает массив данных в случае успеха
   * @param  {Array.<Object>} data массив данных
   * @return {Array.<Object>}      записываем полученные данные
   */
  var onSuccess = function (data) {
    showPins(data);

    return window.data.notices = data;
  }

  /**
   * функция активации страницы
   * @param  {Function} callback передаем коллбэк из модуля работы с сервером
   * @return {[type]}            [description]
   */
  var initPage = function (callback) {
    map.classList.remove('map--faded');
    initForm();
    callback(onSuccess);
  };

  var activePin = null;
  /**
   * запускает логику событий при клике на пине
   * @param  {Element}  node метка с событием
   */
  var isPinClick = function (node) {
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
  var openPopup = function () {
    var image = getSrcOnActivePin(activePin);
    var item = window.renderCard(window.data.notices.filter(function (item) {
      if (item.author.avatar === image) {
        return item;
      }
    })[0]);

    var fragmentCard = document.createDocumentFragment();
    fragmentCard.appendChild(item);

    map.insertBefore(fragmentCard, mapFilters);
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

  /**
   * деактивация страницы
   */
  window.deactivatePage = function () {
    // устанавливаем значения адресного поля по умолчанию
    getAddressCoords(initAddressCoords);

    closePopup();
    // скроем метки похожих объявлений
    Array.from(mapPin).forEach(function (pin) {
      if (!pin.classList.contains('map__pin--main')) {
        pin.classList.add('hidden');
      }
    });

    disableForm();

    map.classList.add('map--faded');

    // сброс значений положения главной метки в исходную позицию
    mapPinMain.style.top = '';
    mapPinMain.style.left = '';
  };

  window.deactivatePage();

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
      if (newY < window.data.coords.MIN_Y) {
        newY = window.data.coords.MIN_Y;
      }

      // вынос за нижнюю границу окна
      // новая нижняя граница элемента
      var newBottom = newY + mapPinMain.offsetHeight / 2 + window.PIN_ARROW_HEIGHT;

      if (newBottom > window.data.coords.MAX_Y) {
        newY = window.data.coords.MAX_Y - (mapPinMain.offsetHeight / 2 + window.PIN_ARROW_HEIGHT);
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
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);

      initPage(window.backend.load);
    };

    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  });
})();
