"use strict";

function getMessage(a,b){
  if (typeof(a) == "boolean") {
    if(a) {
      return ("Я попал в" + b);
    }

    else {
      return ("Я никуда не попал");
    }
  }

  if (typeof(a) == "number") {
    return ("Я прыгнул на " + a*100 + " сантиметров");
  }

  if (a instanceof Array && !(b instanceof Array)){
    var sum=0;
    for (var i = 0; i <a.length; i++) {
      sum=sum+a[i];
    };
    return "Я прошёл " + sum + " шагов";
  }

  if (a instanceof Array && b instanceof Array ){
    var length=0;
    for (var i = 0; i <a.length; i++) {
      length=length+(a[i]*b[i]);
    };
    return "Я прошёл " + length + " метров";
  }
}
