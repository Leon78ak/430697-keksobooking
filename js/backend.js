'use strict';

(function () {

  var StatusCode = {
    OK: 200,
    ERROR: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  };

  var TIMEOUT = 10000;
  var POST_URL = 'https://js.dump.academy/keksobooking';
  var GET_URL = 'https://js.dump.academy/keksobooking/data';

  var setupXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {

      var error;
      switch (xhr.status) {
        case StatusCode.OK:
          onLoad(xhr.response);
          break;

        case StatusCode.ERROR:
          error = 'Неверный запрос';
          break;
        case StatusCode.UNAUTHORIZED:
          error = 'Неавторизованный запрос';
          break;
        case StatusCode.NOT_FOUND:
          error = 'Произошла ошибка соединения';
          break;
        case StatusCode.SERVER_ERROR:
          error = 'Внутренняя ошибка сервера';
          break;

        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + TIMEOUT + 'мс');
    });

    return xhr;
  };

  window.backend = {
    /**
     * Функция для отправки данных на сервер
     * @param  {Object} data    объект FormData, который содержит
     * данные формы, которые будут отправлены на сервер;
     * @param  {requestCallback} onLoad   функция обратного вызова,
     * которая срабатывает при успешном выполнении запроса
     * @param  {requestCallback} onError функция обратного вызова,
     * которая срабатывает при неуспешном выполнении запроса
     */
    save: function (data, onLoad, onError) {

      var xhr = setupXHR(onLoad, onError);

      xhr.open('POST', POST_URL);
      xhr.send(data);
    },
    /**
     * Функция получения данных с сервера
     * @param  {requestCallback} onLoad  функция обратного вызова,
     * которая срабатывает при успешном выполнении запроса
     * @param  {requestCallback} onError функция обратного вызова,
     * которая срабатывает при неуспешном выполнении запроса
     */
    load: function (onLoad, onError) {

      var xhr = setupXHR(onLoad, onError);

      xhr.open('GET', GET_URL);
      xhr.send();
    }
  };
})();
