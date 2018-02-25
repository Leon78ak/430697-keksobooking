'use strict';

(function () {

  var StatusCode = {
    OK: 200,
    ERROR: 400,
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500
  };

  var SERVER_URL = '';
  var SERVER_UPLOAD_URL = '';
  var TIMEOUT = 10000;

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
      SERVER_URL = 'https://js.dump.academy/keksobooking';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

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

      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    },
    /**
     * Функция получения данных с сервера
     * @param  {requestCallback} onLoad  функция обратного вызова,
     * которая срабатывает при успешном выполнении запроса
     * @param  {requestCallback} onError функция обратного вызова,
     * которая срабатывает при неуспешном выполнении запроса
     * @return {[type]}         [description]
     */
    load: function (onLoad, onError) {
      SERVER_UPLOAD_URL = 'https://js.dump.academy/keksobooking/data';

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';


      xhr.addEventListener('load', function () {
        var error;
        switch (xhr.status) {
          case 200:
            onLoad(xhr.response);
            break;

          case 400:
            error = 'Неверный запрос';
            break;
          case 401:
            error = 'Пользователь не авторизован';
            break;
          case 404:
            error = 'Ничего не найдено';
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

      xhr.timeout = TIMEOUT;

      xhr.open('GET', SERVER_UPLOAD_URL);
      xhr.send();

    }
  };
})();
