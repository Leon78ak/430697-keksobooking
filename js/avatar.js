'use strict';

(function () {

  var FYLE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooser = document.querySelector('.upload input[type=file]');
  var preview = document.querySelector('.notice__preview img');
  var dropZone = document.querySelector('.drop-zone');

  /**
   * обработчик событий при выборе файла
   * @param  {Object} evt объект событий
   */
  var onFileSelect = function (evt) {

    if (this === fileChooser) {
      var file = this.files[0];
    } else {
      file = evt.dataTransfer.files[0];
    }

    var fileName = file.name.toLowerCase();

    var mathces = FYLE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (mathces) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
    evt.stopPropagation();
    evt.preventDefault();
  };
  /**
   * обработчик событий при при старте перетаскивания
   * @param  {Object} evt объект событий
   */
  var handleDragOver = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  };
  /**
   * обработчик событий при входе в зону броска
   * @param  {Object} evt объект событий
   */
  var handleDragEnter = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };
  /**
   * обработчик событий при оставлении зоны броска
   * @param  {Object} evt объект событий
   */
  var handleDragLeave = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  fileChooser.addEventListener('change', onFileSelect);
  dropZone.addEventListener('dragenter', handleDragEnter);
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', onFileSelect);
})();
