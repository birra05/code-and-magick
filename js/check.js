'use strict';

function getMessage(a,b){
  if (a === true) {
    if(a) {
      return ('Я попал в' + b);
    }

    else {
      return ('Я никуда не попал');
    }
  }

  if (typeof(a) == 'number') {
    if(a) {
      return ('Я прыгнул на ' + a*100 + ' сантиметров');
    }

    else {

    }
  }

  if (a instanceof Array && b instanceof Array) {
    if(a) {
      var length = 0;
      for (var i = 0; i <a.length; i++) {
        length = length + (a[i]*b[i]);
      };
      return ('Я прошёл ' + length + ' метров');
    }

    else (a instanceof Array) {
      var sum = 0;
      for (var i = 0; i <a.length; i++) {
        sum = sum + a[i];
      };
      return ('Я прошёл ' + sum + ' шагов');
    }
  }
}
