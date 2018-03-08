'use strict';

(function () {

  var fileChooserAvatar = document.querySelector('#avatar');
  var fileChooserImages = document.querySelector('#images');
  var dropZoneAvatar = document.querySelector('.notice__photo .drop-zone');
  var dropZoneImages = document.querySelector('.form__photo-container .drop-zone');
  var avatarPreview = document.querySelector('.notice__preview img');
  var photoPreview = document.querySelector('.form__photo-container');
  var AVATAR_DEFAULT_IMAGE_SRC = 'img/muffin.png';

  /**
   * отрисовка аватара
   * @param  {Object} files  объект из списка файлов
   */
  var renderAvatar = function (files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var imageType = /image.*/;
      if (file.type.match(imageType)) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          avatarPreview.src = reader.result;
        });
        reader.readAsDataURL(file);
      }
    }
  };

  /**
   * отрисовка списка фотографий
   * @param  {Object} files  объект из списка файлов
   */
  var renderImages = function (files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var imageType = /image.*/;
      if (file.type.match(imageType)) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          var image = new Image(70, 70);
          image.src = reader.result;
          photoPreview.appendChild(image);
        });
        reader.readAsDataURL(file);
      }
    }
  };

  /**
   * обработчик событий при выборе файла
   * @param  {Object}   evt      объект событий
   * @param  {Function} callback функция отрисовки фотографий
   */
  var onFileSelect = function (evt, callback) {

    var files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

    callback(files);

    evt.stopPropagation();
    evt.preventDefault();
  };

  /**
   * обработчик событий при при старте перетаскивания
   * @param  {Object} evt объект событий
   */
  var onDragOver = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  };
  /**
   * обработчик событий при входе в зону броска
   * @param  {Object} evt объект событий
   */
  var onDragEnter = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  /**
   * обработчик событий при оставлении зоны броска
   * @param  {Object} evt объект событий
   */
  var onDragLeave = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  /**
   * получаем фотографии на форму
   * @param  {Element} fileChooser  инпут выбора файла
   * @param  {Element} dropZone     поле для сброса файла при перетягивании
   * @param  {callback} renderPhotos функция отрисовки фото из файла
   */
  var getPhotos = function (fileChooser, dropZone, renderPhotos) {
    fileChooser.addEventListener('change', function (evt) {
      onFileSelect(evt, renderPhotos);
    });
    dropZone.addEventListener('dragenter', onDragEnter);
    dropZone.addEventListener('dragover', onDragOver);
    dropZone.addEventListener('dragleave', onDragLeave);
    dropZone.addEventListener('drop', function (evt) {
      onFileSelect(evt, renderPhotos);
    });
  };

  getPhotos(fileChooserAvatar, dropZoneAvatar, renderAvatar);
  getPhotos(fileChooserImages, dropZoneImages, renderImages);

  /**
   * очищает поля выбора фотографий при сбросе формы
   */
  window.resetPhotoPreview = function () {
    avatarPreview.src = AVATAR_DEFAULT_IMAGE_SRC;

    var photoPreviewImages = photoPreview.querySelectorAll('img');
    Array.from(photoPreviewImages).forEach(function (image) {
      image.remove();
    });
  };
})();
