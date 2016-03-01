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
    this.currentNumber = 1;
    this.previewNumberCurrent = document.querySelector('.preview-number-current');
    this.previewNumberTotal = document.querySelector('.preview-number-total');
  };

  Gallery.prototype.array = [];

  // Показать галерею

  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');

    // Показываем текущую картинку в галерее
    // this.setCurrentPicture(0);

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
    console.log(this.array[number]);
    if (number < this.array.length) {
      image.src = this.array[number].src;
      imageContainer.querySelector.innerHTML = '';
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
    console.log('закрытие галереи по нажатию на крестик');
  };

  Gallery.prototype._controlLeftClick = function() {
    console.log('левый контрол работает');
  };

  Gallery.prototype._controlRightClick = function() {
    console.log('правый контрол работает');
  };

  Gallery.prototype._onKeyClick = function(e) {
    switch (e.keyCode) {
      case 27:
        this.hide();
        console.log('закрытие галереи по нажатию ESC');
        break;
      case 37:
        this._controlLeftClick();
        console.log('левый контрол работает по нажатию на клавишу назад');
        break;
      case 39:
        this._controlRightClick();
        console.log('правый контрол работает по нажатию на клавишу вперед');
        break;
    }
  };

  window.Gallery = Gallery;
})();
