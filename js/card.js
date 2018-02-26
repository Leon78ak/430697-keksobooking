'use strict';

(function () {
  var template = document.querySelector('template');
  var similarCardTemplate = template.content.querySelector('.map__card');

  /**
   * соответствие русских значений английским
   * @enum {string}
   */
  var typesToAccomodationName = {
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  /**
   * отрисовка фрагмента карточки с фотографиями
   * @param  {Object} card объект из массива с данными
   * @return {Element}      фрагмент
   */
  var renderPicturesToCard = function (card) {
    var fragment = document.createDocumentFragment();
    var cardPhotos = card.offer.photos;
    cardPhotos.forEach(function (photo)  {
      var popupPicture = document.querySelector('template').content.querySelector('.popup__pictures > *').cloneNode(true);
      var popupImgElement = popupPicture.querySelector('img');
      popupImgElement.src = photo;
      popupImgElement.width = '70';
      popupImgElement.height = '70';
      fragment.appendChild(popupPicture);
    });
    return fragment;
  };

  /**
   * отрисовка фрагмента карточки с удобствами
   * @param  {Object} card объект из массива с данными
   * @return {Element}      фрагмент
   */
  var renderFeaturesToCard = function (card) {
    var fragment = document.createDocumentFragment();
    var cardFeatures = card.offer.features;
    cardFeatures.forEach(function (feature) {
      var featureElement = document.createElement('li');
      featureElement.classList.add('feature', 'feature--' + feature);
      fragment.appendChild(featureElement);
    });
    return fragment;
  };

  var roomsOffer = function (card) {
    if (card.offer.rooms !== '0') {
      return card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
    }
    return 'не для гостей';
  };

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
    cardElement.querySelector('h4').textContent = typesToAccomodationName[card.offer.type];
    cardElement.querySelector('h4 + p').textContent = roomsOffer(card);
    cardElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
    // выводим список доступных удобств
    var ulFeatures = cardElement.querySelector('.popup__features');
    ulFeatures.innerHTML = '';
    ulFeatures.appendChild(renderFeaturesToCard(card));

    cardElement.querySelector('ul + p').textContent = card.offer.description;
    cardElement.querySelector('.popup__avatar').src = card.author.avatar;
    // выводим фото на карточку
    var ulPictures = cardElement.querySelector('.popup__pictures');
    ulPictures.innerHTML = '';
    ulPictures.appendChild(renderPicturesToCard(card));

    return cardElement;
  };

  /**
   * отрисовывавет карточку на страницу
   * @param  {Array.<Object>} card объект с данными из массива
   * @return {Element} фрагмент для вставки
   */
  window.renderCard = function (card) {
    var fragmentCard = document.createDocumentFragment();
    fragmentCard.appendChild(getCardFromTemplate(card));

    return fragmentCard;
  };
})();
