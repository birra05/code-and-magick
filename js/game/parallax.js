'use strict';

var utils = require('../base/utils');
var game = require('./game');

// Двигаем облачка, ставим таймаут и паузу

var clouds = document.querySelector('.header-clouds');
var gameBlock = document.querySelector('.demo');
var IMAGE_WIDTH = 1024;
var scrollTimeout;
var cloudsStart = (clouds.getBoundingClientRect().width - IMAGE_WIDTH) / 2;

window.addEventListener('scroll', function() {

  // В зависимости от положения прокрутки смещается положение блока с облачками

  if (clouds.getBoundingClientRect().bottom > 0) {
    clouds.style.backgroundPosition = cloudsStart - (clouds.getBoundingClientRect().bottom - clouds.getBoundingClientRect().height) + 'px';
  }

  function setPause() {
    if (gameBlock.getBoundingClientRect().bottom <= 0) {
      game.setGameStatus(Game.Verdict.PAUSE);
    }
  };
  scrollTimeout = setTimeout(setPause, 100);
  clearTimeout(scrollTimeout);
});
