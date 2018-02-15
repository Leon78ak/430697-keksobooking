'use strict';

(function () {
  var template = document.querySelector('template');
  var similarCardTemplate = template.content.querySelector('.map__card');
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
    cardElement.querySelector('h4').textContent = card.offer.type;
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
   * @param  {array.<Object>} card объект с данными из массива
   * @return {Element} фрагмент для вставки
   */
  window.renderCard = function (card) {
    var fragmentCard = document.createDocumentFragment();
    fragmentCard.appendChild(getCardFromTemplate(card));

    return fragmentCard;
  };
})();
