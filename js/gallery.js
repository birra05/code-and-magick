'use strict';

(function() {
  var Gallery = function() {
    this.element = document.querySelector('.overlay-gallery');
    this._closeButton = document.querySelector('.overlay-gallery-close');
    this._onCloseClick = this._onCloseClick.bind(this);
    this._controlLeft = document.querySelector('.overlay-gallery-control-left');
    this._controlRight = document.querySelector('.overlay-gallery-control-right');
    this._controlLeftClick = this._controlLeftClick.bind(this);
    this._controlRightClick = this._controlRightClick.bind(this);
    this._onKeyClick = this._onKeyClick.bind(this);
  };

  // Показать галерею

  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');

    // Показываем текущую картинку в галерее
    this.setCurrentPicture(0);

    // Обработчик клика по крестику
    this._closeButton.addEventListener('click', this._onCloseClick);

    // Обработчики клика по левому и правому контролам
    this._controlLeft.addEventListener('click', this._controlLeftClick);
    this._controlRight.addEventListener('click', this._controlRightClick);

    // Нажатие ESC закрывает галерею
    document.addEventListener('keydown', this._onKeyClick);
  };

  Gallery.prototype.setPictures = function(Photo) {
    this._Photos = Photo.slice(0);
  };

  // Взято с кексобукинга, надо переделать под себя

  Gallery.prototype.setCurrentPicture = function(number) {
    var IMAGE_HEIGHT = 300;
    var image = new Image();
    image.src = this._Photos[number]._src;
    image.height = IMAGE_HEIGHT;
    var imageContainer = this.element.querySelector('.overlay-gallery-preview');

    imageContainer.appendChild(image);
  };

  // Скрыть галерею

  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._controlLeft.removeEventListener('click', this._controlLeftClick);
    this._controlRight.removeEventListener('click', this._controlRightClick);
    document.removeEventListener('keydown', this._onKeyClick);
  };

  // События

  Gallery.prototype._onCloseClick = function() {
    this.hide();
    console.log('закрытие галереи по нажатию на крестик');
  };

  Gallery.prototype._controlLeftClick = function() {
    console.log('левый контрол работает');
  };

  Gallery.prototype._controlRightClick = function() {
    console.log('правый контрол работает');
  };

  Gallery.prototype._onKeyClick = function(e) {
    if (e.keyCode === 27) {
      this.hide();
      console.log('закрытие галереи по нажатию ESC');
    }
  };

  window.Gallery = Gallery;
})();
