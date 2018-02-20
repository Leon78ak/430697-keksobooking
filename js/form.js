'use strict';

(function () {
  /**
   * соответствие минимальной цены значению типа жилья
   * @emum {string}
   */
  var typeToPrice = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };
  /**
   * соответствие value комнат количеству гостей
   * @emum {string}
   */
  var roomsToCapacity = {
    '1': '1',
    '2': '2',
    '3': '3',
    '100': '0'
  };

  /**
   * значения для создания новых элементов выбора гостей
   * @enum {string}
   */
  var CAPACITY_VALUE_TEXT = {
    1: 'для 1 гостя',
    2: 'для 2 гостей',
    3: 'для 3 гостей',
    0: 'не для гостей'
  };

  var noticeForm = document.querySelector('.notice__form');
  var titleField = noticeForm.querySelector('#title');
  var timeIn = noticeForm.querySelector('#timein');
  var timeOut = noticeForm.querySelector('#timeout');
  var typeOfAccomodation = noticeForm.querySelector('#type');
  var price = noticeForm.querySelector('#price');
  var roomNumber = noticeForm.querySelector('#room_number');
  var capacity = noticeForm.querySelector('#capacity');
  var reset = noticeForm.querySelector('.form__reset');

  timeIn.addEventListener('change', function (evt) {
    timeOut.value = evt.target.value;
  });

  timeOut.addEventListener('change', function (evt) {
    timeIn.value = evt.target.value;
  });

  /**
   * синхронизирует тип жилья с минимальной ценой
   */
  window.syncPrice = function () {
    var selectedField = typeOfAccomodation.value;
    price.min = typeToPrice[selectedField];
  };

  typeOfAccomodation.addEventListener('change', syncPrice);

  /**
   * синхронизирует значение поля выбора комнат со значением поля количества гостей
   * @return {string} значение поля выбора количества гостей
   */
  var syncRooms = function () {
    var roomNumbers = roomNumber.value;
    var capacityValue = roomsToCapacity[roomNumbers];

    return capacityValue;
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
   * проверяет валидность поля формы
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

  reset.addEventListener('click', function (evt) {
    window.deactivatePage();
    evt.preventDefault();
  })
})();
