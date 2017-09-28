var Review = require('./review');

var reviewFilter = document.querySelector('.reviews-filter');
var reviewsBlock = document.querySelector('.reviews');
// Блок для вывода созданных элементов
var container = document.querySelector('.reviews-list');
var reviews = [];
var filteredReviews = [];
var currentPage = 0;
var PAGE_SIZE = 3;
// Кнопка Еще отзывы
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
});

// Спрятать блок с фильтрами

reviewFilter.classList.add('invisible');

// Вызов функции получения отзывов через http

getReviews();

// Отрисовка списка отзывов

function renderReviews(reviewsArray, pageNumber, replace) {
  // Перезаписывать содержимое контейнера
  if (replace) {
    currentPage = 0;
    // Удаление каждого из элементов через вызов removeChild
    var renderedReviews = container.querySelectorAll('.review');
    [].forEach.call(renderedReviews, function(elem) {
      container.removeChild(elem);
    });
  }
  // Оптимизация отрисовки списка отзывов
  var fragment = document.createDocumentFragment();
  // Для постраничного вывода отзывов
  var from = pageNumber * PAGE_SIZE;
  var to = from + PAGE_SIZE;
  var pageReviews = reviewsArray.slice(from, to);
  // Непосредственно отрисовка отзывов
  pageReviews.forEach(function(review) {
    // Отрисовка каждого отзыва
    var reviewElement = new Review(review);
    reviewElement.render();
    fragment.appendChild(reviewElement.element);
  });
  container.appendChild(fragment);
  reviewsBlock.classList.remove('reviews-list-loading');
  // Определяем, когда показывать кнопку Еще отзывы
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
  // console.log('страница ' + currentPage); //для проверки
}

// Получение данных по http

function getReviews() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/reviews.json');
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

reviewFilter.classList.remove('invisible');
