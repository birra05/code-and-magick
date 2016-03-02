'use strict';

(function() {
  var Gallery = function() {
    this.element = document.querySelector('.overlay-gallery');
    this._closeButton = document.querySelector('.overlay-gallery-close');
    this._onCloseClick = this._onCloseClick.bind(this);
    this._controls = document.querySelector('.overlay-gallery-controls');
    this._controlLeft = document.querySelector('.overlay-gallery-control-left');
    this._controlRight = document.querySelector('.overlay-gallery-control-right');
    this._controlLeftClick = this._controlLeftClick.bind(this);
    this._controlRightClick = this._controlRightClick.bind(this);
    this._onKeyClick = this._onKeyClick.bind(this);
    this.previewNumberCurrent = document.querySelector('.preview-number-current');
    this.previewNumberTotal = document.querySelector('.preview-number-total');
  };

  // Чтобы потом пользоваться массивом, его надо определить

  Gallery.prototype.array = [];

  // Показать галерею

  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');

    // Обработчик клика по крестику
    this._closeButton.addEventListener('click', this._onCloseClick);

    // Обработчики клика по левому и правому контролам
    this._controlLeft.addEventListener('click', this._controlLeftClick);
    this._controlRight.addEventListener('click', this._controlRightClick);

    // Нажатие ESC закрывает галерею
    document.addEventListener('keydown', this._onKeyClick);
  };

  Gallery.prototype.setPictures = function(array) {
    this.array = array;
  };

  // Метод setCurrentPicture(number) берет фотографию
  // с переданным индексом из массива фотографий и отрисовывает показывает ее в галерее

  Gallery.prototype.setCurrentPicture = function(number) {
    this.currentNumber = number;
    var image = new Image();
    var imageContainer = this.element.querySelector('.overlay-gallery-preview');
    if (number < this.array.length) {
      imageContainer.removeChild(imageContainer.lastChild);
      image.src = this.array[number].src;
      image.height = 500;
      imageContainer.appendChild(image);
      this.previewNumberCurrent.textContent = number + 1;
      this.previewNumberTotal.textContent = this.array.length;
    }
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
  };

  Gallery.prototype._controlLeftClick = function() {
    if (this.currentNumber >= 1) {
      this.setCurrentPicture(this.currentNumber - 1);
    }
  };

  Gallery.prototype._controlRightClick = function() {
    if (this.currentNumber < this.array.length - 1) {
      this.setCurrentPicture(this.currentNumber + 1);
    }
  };

  Gallery.prototype._onKeyClick = function(e) {
    switch (e.keyCode) {
      case 27:
        this.hide();
        break;
      case 37:
        this._controlLeftClick();
        break;
      case 39:
        this._controlRightClick();
        break;
    }
  };

  window.Gallery = Gallery;
})();
