'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters-container');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPin = map.querySelectorAll('.map__pin');
  var pinsContainer = map.querySelector('.map__pins');
  var noticeForm = document.querySelector('.notice__form');
  var addressField = noticeForm.querySelector('#address');
  var capacity = noticeForm.querySelector('#capacity');
  var capacitys = capacity.options;

  // координаты главной метки по умолчанию
  var initAddressCoords = {
    x: Math.floor(mapPinMain.offsetTop + mapPinMain.offsetHeight / 2 + window.PIN_ARROW_HEIGHT),
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
    // опции количества мест кроме значения '1 комната' удаляем
    Array.from(capacitys).filter(function (option) {
      if (option.value !== '1') {
        option.remove();
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

    map.insertBefore(window.renderCard(window.data[index - 1]), mapFilters);
  };

  /**
   * скрывает попап
   */
  var closePopup = function () {
    map.removeChild(map.querySelector('.popup'));

    activePin.classList.remove('map__pin--active');
    activePin = null;
  };

  // делегируем обработку клика на пине на блок .map__pins
  pinsContainer.addEventListener('click', function (evt) {
    var target = evt.target;
    while (target !== pinsContainer) {
      if (target.className === 'map__pin') {
        onPinClick(target);

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

  // //закрытие попапа при клике на крестике
  map.addEventListener('click', onPopupClick);
  map.addEventListener('keydown', onPopupKeydownPress, true);

})();
