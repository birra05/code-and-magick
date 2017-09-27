'use strict';

var Gallery = require('./gallery');
var Photo = require('./photo');

var gallery = new Gallery();

var photogalleryItems = document.querySelectorAll('.photogallery-image img');
// Собрать массив объектов Photo
var photosArray = [].map.call(photogalleryItems, function(img, index) {
  img.addEventListener('click', function(evt) {
    evt.preventDefault();
    gallery.show();
    gallery.setCurrentPicture(index);
  });
  return new Photo(img.getAttribute('src'));
});

// Добавить массив фотографий в объект Gallery
gallery.setPictures(photosArray);
