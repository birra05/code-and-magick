/*global docCookies*/

'use strict';

var docCookies = require('../../lib/cookies.js');

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
    checkForm();
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  var reviewForm = document.querySelector('.review-form');
  var reviewName = document.getElementById('review-name');
  var reviewText = document.getElementById('review-text');
  var reviewMark = reviewForm['review-mark'];
  var reviewSubmit = document.querySelector('.review-submit');
  var reviewFields = document.querySelector('.review-fields');
  var reviewNameLabel = reviewFields.querySelector('label[for="review-name"]');
  var reviewTextLabel = reviewFields.querySelector('label[for="review-text"]');

  // Установка начальных значений в полях, берем из cookies

  reviewName.value = docCookies.getItem('name') || '';
  reviewMark.value = docCookies.getItem('mark') || 3;

  reviewName.oninput = checkForm;
  reviewText.oninput = checkForm;

  // По умолчанию поле Отзыв не является обязательным

  reviewName.required = true;
  reviewTextLabel.classList.add('invisible');
  reviewSubmit.disabled = true;

  // Поле Отзыв становится обязательным, если оценка ниже или равна 3

  function reviewMarkCheck() {
    for (var i = 0; i < reviewMark.length; i++) {
      reviewMark[i].onclick = checkForm;
      if (reviewMark[i].checked) {
        if (parseInt(reviewMark[i].value, 10) < 4) {
          reviewTextLabel.classList.remove('invisible');
        } else {
          reviewTextLabel.classList.add('invisible');
        }
      }
    }
  }

  // «Ссылки» исчезают из блока по мере заполнения полей формы

  function reviewNameCheck() {
    if (reviewName.value === '') {
      reviewNameLabel.classList.remove('invisible');
    } else {
      reviewNameLabel.classList.add('invisible');
    }
  }

  function reviewTextCheck() {
    if (!reviewTextLabel.classList.contains('invisible')) {
      if (reviewText.value !== '' && typeof reviewText.value !== 'undefined') {
        reviewTextLabel.classList.add('invisible');
      }
    }
  }

  // Если все обязательные поля заполнены, блок .review-fields исчезает целиком.

  function reviewBlockVisible() {
    if (reviewNameLabel.classList.contains('invisible') && reviewTextLabel.classList.contains('invisible')) {
      reviewFields.classList.add('invisible');
      reviewSubmit.disabled = false;
    } else {
      reviewFields.classList.remove('invisible');
      reviewSubmit.disabled = true;
    }
  }

  // Реакция формы на клики и ввод текста в разных полях

  function checkForm() {
    // console.log('check');
    reviewMarkCheck();
    reviewNameCheck();
    reviewTextCheck();
    reviewBlockVisible();
  }

  // Определяем cookies

  reviewForm.onsubmit = function(evt) {
    evt.preventDefault();

    var nowDate = new Date();
    // День рождения - 5 ноября
    var birthDate = new Date(nowDate.getFullYear(), 10, 5);
    var lastYear = nowDate.getFullYear() - 1;
    if (nowDate < birthDate) {
      var lastBirthDate = new Date(lastYear, 10, 5);
    }

    var dateToExpire = new Date(nowDate.valueOf() + (nowDate - lastBirthDate));
    var formatDateToExpire = new Date(dateToExpire).toUTCString();

    docCookies.setItem('name', reviewName.value, formatDateToExpire);
    docCookies.setItem('mark', reviewMark.value, formatDateToExpire);

    reviewForm.submit();
  };

})();
