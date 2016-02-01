'use strict';

function getMessage(a,b) {
  if (a === true) {
    return ('Я попал в' + b);
  }

  else if (a === false) {
    return ('Я никуда не попал');
  }

  else if (typeof(a) == 'number') {
    return ('Я прыгнул на ' + a*100 + ' сантиметров');
  }

  else if (a instanceof Array && b instanceof Array) {
    var length = 0;
    for (var i = 0; i <a.length; i++) {
      length = length + (a[i]*b[i]);
    };
    return ('Я прошёл ' + length + ' метров');
  }

  else if (a instanceof Array) {
    var sum = 0;
    for (var i = 0; i <a.length; i++) {
      sum = sum + a[i];
    };
    return ('Я прошёл ' + sum + ' шагов');
  }
}
