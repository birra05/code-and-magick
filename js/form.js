'use strict';

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

  var reviewName = document.getElementById('review-name');
  var reviewText = document.getElementById('review-text');
  var reviewMark = document.querySelectorAll('input[name="review-mark"]');
  var reviewSubmit = document.querySelector('.review-submit');
  var reviewFields = document.querySelector('.review-fields');
  var reviewNameLabel = reviewFields.querySelector('label[for="review-name"]');
  var reviewTextLabel = reviewFields.querySelector('label[for="review-text"]');

  reviewName.oninput = checkForm;
  reviewText.oninput = checkForm;

  // По умолчанию поле Отзыв не является обязательным

  reviewName.required = true;
  reviewTextLabel.classList.add('invisible');
  reviewSubmit.disabled = true;

  // Поле Отзыв становится обязательным, если оценка ниже или равна 3

  function reviewMarkCheck() {
    for (var x = 0; x < reviewMark.length; x++) {
      if (reviewMark[x].checked) {
        if (parseInt(reviewMark[x].value, 10) < 4) {
          reviewText.required = true;
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

  function checkForm() {
    console.log('check');
    reviewMarkCheck();
    reviewNameCheck();
    reviewTextCheck();
    reviewBlockVisible();
  }

})();
