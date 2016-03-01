/*global Photo: true, Gallery: true*/

'use strict';

(function() {
  var gallery = new Gallery();

  // var photogallery = document.querySelector('.photogallery');
  var photogalleryItems = document.querySelectorAll('.photogallery-image img');
  // Собрать массив объектов Photo
  var photosArray = [].map.call(photogalleryItems, function(img, index) {
    img.addEventListener('click', function() {
      gallery.show();
      gallery.setCurrentPicture(index);
      console.log(img, index);
    });
    console.log(img, img.src, img.getAttribute('src'));
    return new Photo(img.getAttribute('src'));
  });

  // Добавить массив фотографий в объект Gallery
  gallery.setPictures(photosArray);

})();
