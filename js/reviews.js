'use strict';

(function() {
  var reviewFilter = document.querySelector('.reviews-filter');

  // Спрятать блок с фильтрами

  reviewFilter.classList.add('invisible');

  // Блок для вывода созданных элементов

  var container = document.querySelector('.reviews-list');

  // Вызов функции получения отзывов через http
  getReviews();

  // Для отображения корректного рейтинга

  var ratingArray = {
    1: null,
    2: 'review-rating-two',
    3: 'review-rating-three',
    4: 'review-rating-four',
    5: 'review-rating-five'
  };

  function setRating(element, rate) {
    element.querySelector('.review-rating').classList.add(ratingArray[rate]);
  }

  // Отрисовка списка отелей

  function renderReviews(reviews) {
    reviews.forEach(function(review) {
      var element = getElementFromTemplate(review);
      container.appendChild(element);
    });
  }

  // Получение данных по http

  function getReviews() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//o0.github.io/assets/json/reviews.json');
    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      var loadedReviews = JSON.parse(rawData);

      // Обработка загруженных данных
      renderReviews(loadedReviews);
    };
    xhr.send();
  }

  // Шаблон

  function getElementFromTemplate(data) {
    var template = document.querySelector('#review-template');
    if ('content' in template) {
      var element = template.content.children[0].cloneNode(true);
    } else {
      element = template.children[0].cloneNode(true);
    }

    // Получить данные из шаблона

    element.querySelector('.review-text').textContent = data.description;
    var userImage = new Image(124, 124);
    userImage.src = data.author.picture;
    userImage.title = data.author.name;
    setRating(element, data.rating);

    // Обработчик загрузки

    userImage.onload = function() {
      element.replaceChild(userImage, element.querySelector('.review-author'));
    };

    // Чтобы новое изображение было правильно расположено относительно блока отзыва
    userImage.classList.add('review-author');

    // Обработчик ошибки

    userImage.onerror = function() {
      element.classList.add('review-load-failure');
    };

    return element;
  }

  reviewFilter.classList.remove('invisible');

})();
