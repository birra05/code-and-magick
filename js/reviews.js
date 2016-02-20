/*global reviews*/

'use strict';

(function() {
  var reviewFilter = document.querySelector('.reviews-filter');

  reviewFilter.classList.add('invisible');

  var container = document.querySelector('.reviews-list');

  reviews.forEach(function(review) {
    var element = getElementFromTemplate(review);
    container.appendChild(element);
  });

  // Получение данных из шаблона

  function getElementFromTemplate(data) {
    var template = document.querySelector('#review-template');
    if ('content' in template) {
      var element = template.content.children[0].cloneNode(true);
    } else {
      element = template.children[0].cloneNode(true);
    }

    var userImage = new Image();
    var IMG_SIZE = 124;
    userImage.src = data.author.picture;
    userImage.width = IMG_SIZE;
    userImage.height = IMG_SIZE;
    userImage.title = data.author.name;
    element.querySelector('.review-rating').textContent = data.rating;
    element.querySelector('.review-text').textContent = data.description;

    return element;
  }

})();
