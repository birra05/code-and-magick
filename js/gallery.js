'use strict';

(function() {
  var Gallery = function() {
    this.element = document.querySelector('.overlay-gallery');
    this._closeButton = document.querySelector('.overlay-gallery-close');
  };

  // Показать галерею

  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');

    // Обработчик клика по крестику
    this._closeButton.addEventListener('click', function() {
      this.hide();
    }.bind(this));
  };

  // Скрыть галерею

  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
  };

  window.Gallery = Gallery;
})();
