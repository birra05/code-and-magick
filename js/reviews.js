'use strict';

(function() {
  var reviewFilter = document.querySelector('.reviews-filter');
  var reviewsBlock = document.querySelector('.reviews');
  var reviews = [];
  var filteredReviews = [];
  var currentPage = 0;
  var PAGE_SIZE = 3;
  var moreReviewsButton = document.querySelector('.reviews-controls-more');

  // Делегирование

  var filters = document.querySelector('.reviews-filter');
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('reviews-filter-item')) {
      setActiveFilter(clickedElement.htmlFor);
    }
  });

  // Кнопка Еще отзывы

  moreReviewsButton.addEventListener('click', function() {
    renderReviews(filteredReviews, ++currentPage);
    console.log('страница ' + currentPage); //для проверки
  });

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

  // Отрисовка списка отзывов

  function renderReviews(reviewsArray, pageNumber, replace) {
    console.log(reviewsArray);
    // Перезаписывать содержимое контейнера
    if (replace) {
      container.innerHTML = '';
      currentPage = 0;
    }
    // Оптимизация отрисовки списка отзывов
    var fragment = document.createDocumentFragment();
    // Для постраничного вывода отзывов
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageReviews = reviewsArray.slice(from, to);
    // Непосредственно отрисовка отзывов
    pageReviews.forEach(function(review) {
      var element = getElementFromTemplate(review);
      fragment.appendChild(element);
    });
    container.appendChild(fragment);
    reviewsBlock.classList.remove('reviews-list-loading');
    if (to < filteredReviews.length) {
      moreReviewsButton.classList.remove('invisible');
    } else {
      moreReviewsButton.classList.add('invisible');
    }
  }

  //Фильтры

  function setActiveFilter(id) {

    // Отсортировать и отфильтровать
    filteredReviews = reviews.slice(0);

    switch (id) {
      case 'reviews-all':
        break;
      // Фильтр Недавние — показывает список отзывов, оставленных за две недели, отсортированных по убыванию даты (поле date)
      case 'reviews-recent':
        filteredReviews = filteredReviews.filter(function(elem) {
          var dateTwoWeeksAgo = new Date(elem.date);
          var nowDate = new Date();
          return dateTwoWeeksAgo > nowDate - 14 * 24 * 60 * 60 * 1000;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          var date1 = new Date(a.date);
          var date2 = new Date(b.date);
          return date2 - date1;
        });
        break;
      // Фильтр Хорошие — с рейтингом не ниже 3, отсортированные по убыванию рейтинга (поле rating)
      case 'reviews-good':
        filteredReviews = filteredReviews.filter(function(elem) {
          return elem.rating >= 3;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b.rating - a.rating;
        });
        break;
      // Фильтр Плохие — с рейтингом не выше 2, отсортированные по возрастанию рейтинга
      case 'reviews-bad':
        filteredReviews = filteredReviews.filter(function(elem) {
          return elem.rating < 3;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          return a.rating - b.rating;
        });
        break;
      // Фильтр Популярные — отсортированные по убыванию оценки отзыва (поле review_usefulness)
      case 'reviews-popular':
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b.review_usefulness - a.review_usefulness;
        });
        break;
    }
    renderReviews(filteredReviews, 0, true);
    console.log('страница ' + currentPage); //для проверки
  }

  // Получение данных по http

  function getReviews() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//o0.github.io/assets/json/reviews.json');
    xhr.onload = function(evt) {
      reviewsBlock.classList.add('reviews-list-loading');
      var rawData = evt.target.response;
      var loadedReviews = JSON.parse(rawData);
      reviews = loadedReviews;
      filteredReviews = loadedReviews;

      // Обработка загруженных данных
      renderReviews(filteredReviews, 0, true);
    };
    xhr.onerror = function() {
      reviewsBlock.classList.add('reviews-load-failure');
    };
    xhr.send();
  }

  // Шаблон

  function getElementFromTemplate(data) {
    var template = document.querySelector('#review-template');
    // Для IE
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
