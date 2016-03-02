'use strict';

(function() {
  function Review(data) {
    this._data = data;
  }

  // Получить объект из шаблона
  Review.prototype.render = function() {
    // Копируем getElementFromTemplate, которая раньше была в reviews.js
    var template = document.querySelector('#review-template');
    // Для IE
    if ('content' in template) {
      this.element = template.content.children[0].cloneNode(true);
    } else {
      this.element = template.children[0].cloneNode(true);
    }

    // Данные из шаблона на сервере

    this.element.querySelector('.review-text').textContent = this._data.description;
    var userImage = new Image(124, 124);
    userImage.src = this._data.author.picture;
    userImage.title = this._data.author.name;
    setRating(this.element, this._data.rating);

    // Обработчик загрузки

    userImage.onload = function() {
      this.element.replaceChild(userImage, this.element.querySelector('.review-author'));
    }.bind(this);

    // Чтобы новое изображение было правильно расположено относительно блока отзыва
    userImage.classList.add('review-author');

    // Обработчик ошибки

    userImage.onerror = function() {
      this.element.classList.add('review-load-failure');
    }.bind(this);
  };

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

  window.Review = Review;
})();
