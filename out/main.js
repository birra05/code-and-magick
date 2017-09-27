/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/*global docCookies*/

'use strict';

var docCookies = __webpack_require__(9);

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


/***/ },
/* 2 */
/***/ function(module, exports) {

"use strict";
"use strict";!function(){function a(a,b,c,d,e,f){for(var g=b.split("\n"),h=0;h<g.length;h++){for(var i="",j=g[h].split(" "),k=0;k<j.length;k++){var l=i+j[k]+" ",m=a.measureText(l),n=m.width;n>e?(a.fillText(i,c,d),i=j[k]+" ",d+=f):i=l}a.fillText(i,c,d),d+=f}}function b(a,b,c){c.moveTo(a+.3*e,b+.3*d),c.lineTo(a+.8*e,b+.3*d-10),c.lineTo(a+.8*e-30,b+.7*d),c.lineTo(a+.3*e-30,b+.7*d+30),c.lineTo(a+.3*e+4,b+.3*d-4),c.fill(),c.stroke()}function c(){return"function"==typeof window.getMessage?window.getMessage.apply(null,arguments):"\u041d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430 \u0444\u0443\u043d\u043a\u0446\u0438\u044f getMessage, \u043a\u043e\u0442\u043e\u0440\u0430\u044f \u0434\u043e\u043b\u0436\u043d\u0430 \u0431\u044b\u0442\u044c \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0430 \u0432 \u0433\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 \u0432\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u0438 \u0432 \u0444\u0430\u0439\u043b\u0435 check.js"}function s(){var a=q.container.getBoundingClientRect();(a.bottom<.75*d||a.top>window.innerHeight-.5*d)&&q.setGameStatus(p.Verdict.PAUSE)}function w(){var a=r.getBoundingClientRect();a.bottom>0&&(r.style.backgroundPositionX=-document.body.scrollTop/2+"px")}var d=300,e=700,f={INTRO:0},g=[f.INTRO],h=g[0],i={ME:0,FIREBALL:1},j={OK:0,DISPOSED:1},k={NULL:0,LEFT:1,RIGHT:2,UP:4,DOWN:8},l={};l[i.ME]=function(a,b,c){b.keysPressed.UP&&a.y>0&&(a.direction=a.direction&~k.DOWN,a.direction=a.direction|k.UP,a.y-=a.speed*c*2,a.y<0&&(a.y=0)),b.keysPressed.UP||(a.y<d-a.height?(a.direction=a.direction&~k.UP,a.direction=a.direction|k.DOWN,a.y+=a.speed*c/3):a.direction=a.direction&~k.DOWN),b.keysPressed.LEFT&&(a.direction=a.direction&~k.RIGHT,a.direction=a.direction|k.LEFT,a.x-=a.speed*c),b.keysPressed.RIGHT&&(a.direction=a.direction&~k.LEFT,a.direction=a.direction|k.RIGHT,a.x+=a.speed*c),a.y<0&&(a.y=0,a.Direction=a.direction&~k.DOWN,a.Direction=a.direction&~k.UP),a.y>d-a.height&&(a.y=d-a.height,a.Direction=a.direction&~k.DOWN,a.Direction=a.direction&~k.UP),a.x<0&&(a.x=0),a.x>e-a.width&&(a.x=e-a.width)},l[i.FIREBALL]=function(a,b,c){a.direction&k.LEFT&&(a.x-=a.speed*c),a.direction&k.RIGHT&&(a.x+=a.speed*c),(a.x<0||a.x>e)&&(a.state=j.DISPOSED)};var m={CONTINUE:0,WIN:1,FAIL:2,PAUSE:3,INTRO:4},n={};n[f.INTRO]=function(){return m.CONTINUE};var o={};o[f.INTRO]=function(a){return a.objects.push({direction:k.RIGHT,height:84,speed:2,sprite:"img/wizard.gif",spriteReversed:"img/wizard-reversed.gif",state:j.OK,type:i.ME,width:61,x:e/2,y:d-100}),a};var p=function(a){this.container=a,this.canvas=document.createElement("canvas"),this.canvas.width=a.clientWidth,this.canvas.height=a.clientHeight,this.container.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d"),this._onKeyDown=this._onKeyDown.bind(this),this._onKeyUp=this._onKeyUp.bind(this),this._pauseListener=this._pauseListener.bind(this)};p.prototype={level:h,getInitialState:function(){return{currentStatus:m.CONTINUE,garbage:[],lastUpdated:null,keysPressed:{ESC:!1,LEFT:!1,RIGHT:!1,SPACE:!1,UP:!1},levelStartTime:null,objects:[],startTime:null,customMessage:null}},initializeLevelAndStart:function(a,b){a="undefined"==typeof a?this.level:a,b="undefined"==typeof b?!0:b,b||!this.state?this.state=this._getInitialLevelState(this.level):this.state.currentStatus=m.CONTINUE,this.state.levelStartTime=Date.now(),this.state.startTime||(this.state.startTime=this.state.levelStartTime),this._preloadImagesForLevel(function(){this.render(),this._initializeGameListeners(),this.update()}.bind(this))},pauseLevel:function(a){a&&(this.state.currentStatus=a),this.state.keysPressed.ESC=!1,this.state.lastUpdated=null,this._removeGameListeners(),window.addEventListener("keydown",this._pauseListener),this._drawPauseScreen()},_pauseListener:function(a){if(32===a.keyCode){a.preventDefault();var b=this.state.currentStatus===m.WIN||this.state.currentStatus===m.FAIL;this.initializeLevelAndStart(this.level,b),window.removeEventListener("keydown",this._pauseListener)}},_drawMessage:function(c,f){f=!!f,f?this.ctx.strokeStyle="red":this.ctx.strokeStyle="#0066ff",this.ctx.lineWidth=10,this.ctx.fillStyle="white",this.ctx.font="16px PT Mono",b(0,0,this.ctx),this.ctx.fillStyle="black";var g=.3*d+30;f||(g+=30),a(this.ctx,c,.3*e+15,g,.75*e-.3*e-10,20)},_drawPauseScreen:function(){switch(this.state.currentStatus){case m.WIN:this._drawMessage(this.state.customMessage+". \u041f\u0440\u043e\u0431\u0435\u043b \u0434\u043b\u044f \u0440\u0435\u0441\u0442\u0430\u0440\u0442\u0430."||"you have won!");break;case m.FAIL:this._drawMessage(this.state.customMessage+". \u041f\u0440\u043e\u0431\u0435\u043b \u0434\u043b\u044f \u0440\u0435\u0441\u0442\u0430\u0440\u0442\u0430."||"you have failed!",!0);break;case m.PAUSE:this._drawMessage("\u041f\u0430\u0443\u0437\u0430. \u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043f\u0440\u043e\u0431\u0435\u043b \u0434\u043b\u044f \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0435\u043d\u0438\u044f \u0438\u0433\u0440\u044b");break;case m.INTRO:this._drawMessage("\u0414\u043b\u044f \u043d\u0430\u0447\u0430\u043b\u0430 \u0438\u0433\u0440\u044b \u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u043f\u0440\u043e\u0431\u0435\u043b")}},_preloadImagesForLevel:function(a){if("undefined"==typeof this._imagesArePreloaded&&(this._imagesArePreloaded=[]),this._imagesArePreloaded[this.level])return void a();var b=[];this.state.objects.forEach(function(a){b.push(a.sprite),a.spriteReversed&&b.push(a.spriteReversed)});for(var c=b.length,d=b.length;c-->0;){var e=new Image;e.src=b[c],e.onload=function(){0===--d&&(this._imagesArePreloaded[this.level]=!0,a())}.bind(this)}},updateObjects:function(a){var b=this.state.objects.filter(function(a){return a.type===i.ME})[0];this.state.keysPressed.SHIFT&&(this.state.objects.push({direction:b.direction,height:24,speed:5,sprite:"img/fireball.gif",type:i.FIREBALL,width:24,x:b.direction&k.RIGHT?b.x+b.width:b.x-24,y:b.y+b.height/2}),this.state.keysPressed.SHIFT=!1),this.state.garbage=[];var c=this.state.objects.filter(function(b){return l[b.type](b,this.state,a),b.state===j.DISPOSED?(this.state.garbage.push(b),!1):!0},this);this.state.objects=c},checkStatus:function(){if(this.state.currentStatus===m.CONTINUE){this.commonRules||(this.commonRules=[function(a){var b=this._getInitialLevelState(f.INTRO),d=this._getMe(a),e=this._getMe(b);return d.x-e.x>=200?(a.customMessage=c([1,2,3,4]),"\u042f \u043f\u0440\u043e\u0448\u0451\u043b 10 \u0448\u0430\u0433\u043e\u0432"===a.customMessage?m.WIN:m.FAIL):m.CONTINUE},function(a){var b=this._getInitialLevelState(f.INTRO),d=this._getMe(a),e=this._getMe(b);return d.x-e.x<=-200?(a.customMessage=c([1,2,3,4],[4,3,2,1]),"\u042f \u043f\u0440\u043e\u0448\u0451\u043b 20 \u043c\u0435\u0442\u0440\u043e\u0432"===a.customMessage?m.WIN:m.FAIL):m.CONTINUE},function(a){var b=this._getMe(a);return b.y<=10?(a.customMessage=c(2),"\u042f \u043f\u0440\u044b\u0433\u043d\u0443\u043b \u043d\u0430 200 \u0441\u0430\u043d\u0442\u0438\u043c\u0435\u0442\u0440\u043e\u0432"===a.customMessage?m.WIN:m.FAIL):m.CONTINUE},function(a){function g(a){return!!(a.direction&k.RIGHT)&&a.x>=e-10&&a.y>=b&&a.y<=f}var h,b=.5*d,f=.75*d;if(a.garbage.length){var j=a.garbage.filter(function(a){return a.type===i.FIREBALL});j.length&&(h=j[0])}if(h){var l=g(h);return a.customMessage=c(l,"\u043a\u0440\u043e\u043d\u0443 \u0434\u0435\u0440\u0435\u0432\u0430"),l?"\u042f \u043f\u043e\u043f\u0430\u043b \u0432 \u043a\u0440\u043e\u043d\u0443 \u0434\u0435\u0440\u0435\u0432\u0430"===a.customMessage?m.WIN:m.FAIL:"\u042f \u043d\u0438\u043a\u0443\u0434\u0430 \u043d\u0435 \u043f\u043e\u043f\u0430\u043b"===a.customMessage?m.WIN:m.FAIL}return m.CONTINUE},function(a){return a.keysPressed.ESC?m.PAUSE:m.CONTINUE}]);for(var g,a=this.commonRules.concat(n[this.level]),b=m.CONTINUE;b===m.CONTINUE&&a.length;)g=a.shift(),b=g.call(this,this.state);this.state.currentStatus=b}},setGameStatus:function(a){this.state.currentStatus!==a&&(this.state.currentStatus=a)},render:function(){this.ctx.clearRect(0,0,e,d),this.state.objects.forEach(function(a){if(a.sprite){var b=new Image(a.width,a.height);b.src=a.spriteReversed&&a.direction&k.LEFT?a.spriteReversed:a.sprite,this.ctx.drawImage(b,a.x,a.y,a.width,a.height)}},this)},update:function(){this.state.lastUpdated||(this.state.lastUpdated=Date.now());var a=(Date.now()-this.state.lastUpdated)/10;switch(this.updateObjects(a),this.checkStatus(),this.state.currentStatus){case m.CONTINUE:this.state.lastUpdated=Date.now(),this.render(),requestAnimationFrame(function(){this.update()}.bind(this));break;case m.WIN:case m.FAIL:case m.PAUSE:case m.INTRO:default:this.pauseLevel()}},_onKeyDown:function(a){switch(a.keyCode){case 37:a.preventDefault(),this.state.keysPressed.LEFT=!0;break;case 39:a.preventDefault(),this.state.keysPressed.RIGHT=!0;break;case 38:a.preventDefault(),this.state.keysPressed.UP=!0;break;case 27:a.preventDefault(),this.state.keysPressed.ESC=!0}a.shiftKey&&(this.state.keysPressed.SHIFT=!0)},_onKeyUp:function(a){switch(a.keyCode){case 37:this.state.keysPressed.LEFT=!1;break;case 39:this.state.keysPressed.RIGHT=!1;break;case 38:this.state.keysPressed.UP=!1;break;case 27:this.state.keysPressed.ESC=!1}a.shiftKey&&(this.state.keysPressed.SHIFT=!1)},_initializeGameListeners:function(){window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp)},_removeGameListeners:function(){window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp)},_getMe:function(a){return a.objects.filter(function(a){return a.type===i.ME})[0]},_getInitialLevelState:function(a){var b=this.getInitialState();return o[a](b)}},window.Game=p,window.Game.Verdict=m;var q=new p(document.querySelector(".demo"));q.initializeLevelAndStart(),q.setGameStatus(p.Verdict.CONTINUE);var t,v,r=document.querySelector(".header-clouds"),u=!1;window.addEventListener("scroll",function(){v||(v=Date.now()),u||(u=!0,requestAnimationFrame(function(){w(),u=!1})),clearTimeout(t),t=setTimeout(s,100),v=Date.now()}),w()}();

/***/ },
/* 3 */
/***/ function(module, exports) {

"use strict";
'use strict';

(function() {
  /**
   * @const
   * @type {number}
   */
  var HEIGHT = 300;

  /**
   * @const
   * @type {number}
   */
  var WIDTH = 700;

  /**
   * ID уровней.
   * @enum {number}
   */
  var Level = {
    'INTRO': 0,
    'MOVE_LEFT': 1,
    'MOVE_RIGHT': 2,
    'LEVITATE': 3,
    'HIT_THE_MARK': 4
  };

  /**
   * Порядок прохождения уровней.
   * @type {Array.<Level>}
   */
  var LevelSequence = [
    Level.INTRO
  ];

  /**
   * Начальный уровень.
   * @type {Level}
   */
  var INITIAL_LEVEL = LevelSequence[0];

  /**
   * Допустимые виды объектов на карте.
   * @enum {number}
   */
  var ObjectType = {
    'ME': 0,
    'FIREBALL': 1
  };

  /**
   * Допустимые состояния объектов.
   * @enum {number}
   */
  var ObjectState = {
    'OK': 0,
    'DISPOSED': 1
  };

  /**
   * Коды направлений.
   * @enum {number}
   */
  var Direction = {
    NULL: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 4,
    DOWN: 8
  };

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

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      // Если игра не видна — поставить игру на паузу
      if (gameBlock.getBoundingClientRect().bottom <= 0) {
        game.setGameStatus(window.Game.Verdict.PAUSE);
      }
    }, 100);
  });

  /**
   * Правила перерисовки объектов в зависимости от состояния игры.
   * @type {Object.<ObjectType, function(Object, Object, number): Object>}
   */
  var ObjectsBehaviour = {};

  /**
   * Обновление движения мага. Движение мага зависит от нажатых в данный момент
   * стрелок. Маг может двигаться одновременно по горизонтали и по вертикали.
   * На движение мага влияет его пересечение с препятствиями.
   * @param {Object} object
   * @param {Object} state
   * @param {number} timeframe
   */
  ObjectsBehaviour[ObjectType.ME] = function(object, state, timeframe) {
    // Пока зажата стрелка вверх, маг сначала поднимается, а потом левитирует
    // в воздухе на определенной высоте.
    // NB! Сложность заключается в том, что поведение описано в координатах
    // канваса, а не координатах, относительно нижней границы игры.
    if (state.keysPressed.UP && object.y > 0) {
      object.direction = object.direction & ~Direction.DOWN;
      object.direction = object.direction | Direction.UP;
      object.y -= object.speed * timeframe * 2;

      if (object.y < 0) {
        object.y = 0;
      }
    }

    // Если стрелка вверх не зажата, а маг находится в воздухе, он плавно
    // опускается на землю.
    if (!state.keysPressed.UP) {
      if (object.y < HEIGHT - object.height) {
        object.direction = object.direction & ~Direction.UP;
        object.direction = object.direction | Direction.DOWN;
        object.y += object.speed * timeframe / 3;
      } else {
        object.Direction = object.direction & ~Direction.DOWN;
      }
    }

    // Если зажата стрелка влево, маг перемещается влево.
    if (state.keysPressed.LEFT) {
      object.direction = object.direction & ~Direction.RIGHT;
      object.direction = object.direction | Direction.LEFT;
      object.x -= object.speed * timeframe;
    }

    // Если зажата стрелка вправо, маг перемещается вправо.
    if (state.keysPressed.RIGHT) {
      object.direction = object.direction & ~Direction.LEFT;
      object.direction = object.direction | Direction.RIGHT;
      object.x += object.speed * timeframe;
    }

    // Ограничения по перемещению по полю. Маг не может выйти за пределы поля.
    if (object.y < 0) {
      object.y = 0;
      object.Direction = object.direction & ~Direction.DOWN;
      object.Direction = object.direction & ~Direction.UP;
    }

    if (object.y > HEIGHT - object.height) {
      object.y = HEIGHT - object.height;
      object.Direction = object.direction & ~Direction.DOWN;
      object.Direction = object.direction & ~Direction.UP;
    }

    if (object.x < 0) {
      object.x = 0;
    }

    if (object.x > WIDTH - object.width) {
      object.x = WIDTH - object.width;
    }
  };

  /**
   * Обновление движения файрбола. Файрбол выпускается в определенном направлении
   * и после этого неуправляемо движется по прямой в заданном направлении. Если
   * он пролетает весь экран насквозь, он исчезает.
   * @param {Object} object
   * @param {Object} state
   * @param {number} timeframe
   */
  ObjectsBehaviour[ObjectType.FIREBALL] = function(object, state, timeframe) {
    if (object.direction & Direction.LEFT) {
      object.x -= object.speed * timeframe;
    }

    if (object.direction & Direction.RIGHT) {
      object.x += object.speed * timeframe;
    }

    if (object.x < 0 || object.x > WIDTH) {
      object.state = ObjectState.DISPOSED;
    }
  };

  /**
   * ID возможных ответов функций, проверяющих успех прохождения уровня.
   * CONTINUE говорит о том, что раунд не закончен и игру нужно продолжать,
   * WIN о том, что раунд выигран, FAIL — о поражении. PAUSE о том, что игру
   * нужно прервать.
   * @enum {number}
   */
  var Verdict = {
    'CONTINUE': 0,
    'WIN': 1,
    'FAIL': 2,
    'PAUSE': 3,
    'INTRO': 4
  };

  /**
   * Правила завершения уровня. Ключами служат ID уровней, значениями функции
   * принимающие на вход состояние уровня и возвращающие true, если раунд
   * можно завершать или false если нет.
   * @type {Object.<Level, function(Object):boolean>}
   */
  var LevelsRules = {};

  /**
   * Уровень считается пройденным, если был выпущен файлболл и он улетел
   * за экран.
   * @param {Object} state
   * @return {Verdict}
   */
  LevelsRules[Level.INTRO] = function(state) {
    var fireballs = state.garbage.filter(function(object) {
      return object.type === ObjectType.FIREBALL;
    });

    return fireballs.length ? Verdict.WIN : Verdict.CONTINUE;
  };

  /**
   * Начальные условия для уровней.
   * @enum {Object.<Level, function>}
   */
  var LevelsInitialize = {};

  /**
   * Первый уровень.
   * @param {Object} state
   * @return {Object}
   */
  LevelsInitialize[Level.INTRO] = function(state) {
    state.objects.push(
      // Установка персонажа в начальное положение. Он стоит в крайнем левом
      // углу экрана, глядя вправо. Скорость перемещения персонажа на этом
      // уровне равна 2px за кадр.
      {
        direction: Direction.RIGHT,
        height: 84,
        speed: 2,
        sprite: 'img/wizard.gif',
        spriteReversed: 'img/wizard-reversed.gif',
        state: ObjectState.OK,
        type: ObjectType.ME,
        width: 61,
        x: WIDTH / 3,
        y: HEIGHT - 100
      }
    );

    return state;
  };

  /**
   * Конструктор объекта Game. Создает canvas, добавляет обработчики событий
   * и показывает приветственный экран.
   * @param {Element} container
   * @constructor
   */
  var Game = function(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._pauseListener = this._pauseListener.bind(this);
  };

  Game.prototype = {
    /**
     * Текущий уровень игры.
     * @type {Level}
     */
    level: INITIAL_LEVEL,

    /**
     * Состояние игры. Описывает местоположение всех объектов на игровой карте
     * и время проведенное на уровне и в игре.
     * @return {Object}
     */
    getInitialState: function() {
      return {
        // Статус игры. Если CONTINUE, то игра продолжается.
        currentStatus: Verdict.CONTINUE,

        // Объекты, удаленные на последнем кадре.
        garbage: [],

        // Время с момента отрисовки предыдущего кадра.
        lastUpdated: null,

        // Состояние нажатых клавиш.
        keysPressed: {
          ESC: false,
          LEFT: false,
          RIGHT: false,
          SPACE: false,
          UP: false
        },

        // Время начала прохождения уровня.
        levelStartTime: null,

        // Все объекты на карте.
        objects: [],

        // Время начала прохождения игры.
        startTime: null
      };
    },

    /**
     * Начальные проверки и запуск текущего уровня.
     * @param {Level=} level
     * @param {boolean=} restart
     */
    initializeLevelAndStart: function(level, restart) {
      level = typeof level === 'undefined' ? this.level : level;
      restart = typeof restart === 'undefined' ? true : restart;

      if (restart || !this.state) {
        // При перезапуске уровня, происходит полная перезапись состояния
        // игры из изначального состояния.
        this.state = this.getInitialState();
        this.state = LevelsInitialize[this.level](this.state);
      } else {
        // При продолжении уровня состояние сохраняется, кроме записи о том,
        // что состояние уровня изменилось с паузы на продолжение игры.
        this.state.currentStatus = Verdict.CONTINUE;
      }

      // Запись времени начала игры и времени начала уровня.
      this.state.levelStartTime = Date.now();
      if (!this.state.startTime) {
        this.state.startTime = this.state.levelStartTime;
      }

      this._preloadImagesForLevel(function() {
        // Предварительная отрисовка игрового экрана.
        this.render();

        // Установка обработчиков событий.
        this._initializeGameListeners();

        // Запуск игрового цикла.
        this.update();
      }.bind(this));
    },

    /**
     * Временная остановка игры.
     * @param {Verdict=} verdict
     */
    pauseLevel: function(verdict) {
      if (verdict) {
        this.state.currentStatus = verdict;
      }

      this.state.keysPressed.ESC = false;
      this.state.lastUpdated = null;

      this._removeGameListeners();
      window.addEventListener('keydown', this._pauseListener);

      this._drawPauseScreen();
    },

    /**
     * Обработчик событий клавиатуры во время паузы.
     * @param {KeyboardsEvent} evt
     * @private
     * @private
     */
    _pauseListener: function(evt) {
      if (evt.keyCode === 32) {
        evt.preventDefault();
        var needToRestartTheGame = this.state.currentStatus === Verdict.WIN ||
            this.state.currentStatus === Verdict.FAIL;
        this.initializeLevelAndStart(this.level, needToRestartTheGame);

        window.removeEventListener('keydown', this._pauseListener);
      }
    },

    /**
     * Отрисовка сообщения.
     */

    _drawMessage: function(message) {

      var ctx = this.ctx;

      // тень
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.moveTo(320, 90);
      ctx.lineTo(620, 90);
      ctx.lineTo(620, 200);
      ctx.lineTo(300, 220);
      ctx.fill();

      // окно
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(310, 80);
      ctx.lineTo(610, 80);
      ctx.lineTo(610, 190);
      ctx.lineTo(290, 210);
      ctx.fill();

      // текст
      var words = message.split(' ');
      var countWords = words.length;
      var line = '';
      var maxWidth = 280;
      var marginLeft = 330;
      var marginTop = 120;
      var lineHeight = 20;
      ctx.fillStyle = '#000';
      ctx.font = '16px PT Mono';

      for (var n = 0; n < countWords; n++) {
        var textLine = line + words[n] + ' ';
        var textWidth = ctx.measureText(textLine).width;
        if (textWidth > maxWidth) {
          ctx.fillText(line, marginLeft, marginTop);
          line = words[n] + ' ';
          marginTop += lineHeight;
        } else {
          line = textLine;
        }
      }

      ctx.fillText(line, marginLeft, marginTop);
    },

     /**
     * Отрисовка экрана паузы.
     */

    _drawPauseScreen: function() {
      switch (this.state.currentStatus) {
        case Verdict.WIN:
          this._drawMessage('Вы победили!');
          // console.log('you have won!');
          break;
        case Verdict.FAIL:
          this._drawMessage('Вы проиграли!');
          // console.log('you have failed!');
          break;
        case Verdict.PAUSE:
          this._drawMessage('Пауза. Нажмите Пробел для продолжения');
          // console.log('game is on pause!');
          break;
        case Verdict.INTRO:
          this._drawMessage('Добро пожаловать в игру! Нажмите Пробел для продолжения');
          // console.log('welcome to the game! Press Space to start');
          break;
      }
    },

    /**
     * Предзагрузка необходимых изображений для уровня.
     * @param {function} callback
     * @private
     */
    _preloadImagesForLevel: function(callback) {
      if (typeof this._imagesArePreloaded === 'undefined') {
        this._imagesArePreloaded = [];
      }

      if (this._imagesArePreloaded[this.level]) {
        callback();
        return;
      }

      var levelImages = [];
      this.state.objects.forEach(function(object) {
        levelImages.push(object.sprite);

        if (object.spriteReversed) {
          levelImages.push(object.spriteReversed);
        }
      });

      var i = levelImages.length;
      var imagesToGo = levelImages.length;

      while (i-- > 0) {
        var image = new Image();
        image.src = levelImages[i];
        image.onload = function() {
          if (--imagesToGo === 0) {
            this._imagesArePreloaded[this.level] = true;
            callback();
          }
        }.bind(this);
      }
    },

    /**
     * Обновление статуса объектов на экране. Добавляет объекты, которые должны
     * появиться, выполняет проверку поведения всех объектов и удаляет те, которые
     * должны исчезнуть.
     * @param {number} delta Время, прошеднее с отрисовки прошлого кадра.
     */
    updateObjects: function(delta) {
      // Персонаж.
      var me = this.state.objects.filter(function(object) {
        return object.type === ObjectType.ME;
      })[0];

      // Добавляет на карту файрбол по нажатию на Shift.
      if (this.state.keysPressed.SHIFT) {
        this.state.objects.push({
          direction: me.direction,
          height: 24,
          speed: 5,
          sprite: 'img/fireball.gif',
          type: ObjectType.FIREBALL,
          width: 24,
          x: me.direction & Direction.RIGHT ? me.x + me.width : me.x - 24,
          y: me.y + me.height / 2
        });

        this.state.keysPressed.SHIFT = false;
      }

      this.state.garbage = [];

      // Убирает в garbage не используемые на карте объекты.
      var remainingObjects = this.state.objects.filter(function(object) {
        ObjectsBehaviour[object.type](object, this.state, delta);

        if (object.state === ObjectState.DISPOSED) {
          this.state.garbage.push(object);
          return false;
        }

        return true;
      }, this);

      this.state.objects = remainingObjects;
    },

    /**
     * Проверка статуса текущего уровня.
     */
    checkStatus: function() {
      // Нет нужны запускать проверку, нужно ли останавливать уровень, если
      // заранее известно, что да.
      if (this.state.currentStatus !== Verdict.CONTINUE) {
        return;
      }

      if (!this.commonRules) {
        /**
         * Проверки, не зависящие от уровня, но влияющие на его состояние.
         * @type {Array.<functions(Object):Verdict>}
         */
        this.commonRules = [
          /**
           * Если персонаж мертв, игра прекращается.
           * @param {Object} state
           * @return {Verdict}
           */
          function checkDeath(state) {
            var me = state.objects.filter(function(object) {
              return object.type === ObjectType.ME;
            })[0];

            return me.state === ObjectState.DISPOSED ?
                Verdict.FAIL :
                Verdict.CONTINUE;
          },

          /**
           * Если нажата клавиша Esc игра ставится на паузу.
           * @param {Object} state
           * @return {Verdict}
           */
          function checkKeys(state) {
            return state.keysPressed.ESC ? Verdict.PAUSE : Verdict.CONTINUE;
          },

          /**
           * Игра прекращается если игрок продолжает играть в нее два часа подряд.
           * @param {Object} state
           * @return {Verdict}
           */
          function checkTime(state) {
            return Date.now() - state.startTime > 3 * 60 * 1000 ?
                Verdict.FAIL :
                Verdict.CONTINUE;
          }
        ];
      }

      // Проверка всех правил влияющих на уровень. Запускаем цикл проверок
      // по всем универсальным проверкам и проверкам конкретного уровня.
      // Цикл продолжается до тех пор, пока какая-либо из проверок не вернет
      // любое другое состояние кроме CONTINUE или пока не пройдут все
      // проверки. После этого состояние сохраняется.
      var allChecks = this.commonRules.concat(LevelsRules[this.level]);
      var currentCheck = Verdict.CONTINUE;
      var currentRule;

      while (currentCheck === Verdict.CONTINUE && allChecks.length) {
        currentRule = allChecks.shift();
        currentCheck = currentRule(this.state);
      }

      this.state.currentStatus = currentCheck;
    },

    /**
     * Принудительная установка состояния игры. Используется для изменения
     * состояния игры от внешних условий, например, когда необходимо остановить
     * игру, если она находится вне области видимости и установить вводный
     * экран.
     * @param {Verdict} status
     */
    setGameStatus: function(status) {
      if (this.state.currentStatus !== status) {
        this.state.currentStatus = status;
      }
    },

    /**
     * Отрисовка всех объектов на экране.
     */
    render: function() {
      // Удаление всех отрисованных на странице элементов.
      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // Выставление всех элементов, оставшихся в this.state.objects согласно
      // их координатам и направлению.
      this.state.objects.forEach(function(object) {
        if (object.sprite) {
          var image = new Image(object.width, object.height);
          image.src = (object.spriteReversed && object.direction & Direction.LEFT) ?
              object.spriteReversed :
              object.sprite;
          this.ctx.drawImage(image, object.x, object.y, object.width, object.height);
        }
      }, this);
    },

    /**
     * Основной игровой цикл. Сначала проверяет состояние всех объектов игры
     * и обновляет их согласно правилам их поведения, а затем запускает
     * проверку текущего раунда. Рекурсивно продолжается до тех пор, пока
     * проверка не вернет состояние FAIL, WIN или PAUSE.
     */
    update: function() {
      if (!this.state.lastUpdated) {
        this.state.lastUpdated = Date.now();
      }

      var delta = (Date.now() - this.state.lastUpdated) / 10;
      this.updateObjects(delta);
      this.checkStatus();

      switch (this.state.currentStatus) {
        case Verdict.CONTINUE:
          this.state.lastUpdated = Date.now();
          this.render();
          requestAnimationFrame(function() {
            this.update();
          }.bind(this));
          break;

        case Verdict.WIN:
        case Verdict.FAIL:
        case Verdict.PAUSE:
        case Verdict.INTRO:
        default:
          this.pauseLevel();
          break;
      }
    },

    /**
     * @param {KeyboardEvent} evt [description]
     * @private
     */
    _onKeyDown: function(evt) {
      switch (evt.keyCode) {
        case 37:
          this.state.keysPressed.LEFT = true;
          break;
        case 39:
          this.state.keysPressed.RIGHT = true;
          break;
        case 38:
          this.state.keysPressed.UP = true;
          break;
        case 27:
          this.state.keysPressed.ESC = true;
          break;
      }

      if (evt.shiftKey) {
        this.state.keysPressed.SHIFT = true;
      }
    },

    /**
     * @param {KeyboardEvent} evt [description]
     * @private
     */
    _onKeyUp: function(evt) {
      switch (evt.keyCode) {
        case 37:
          this.state.keysPressed.LEFT = false;
          break;
        case 39:
          this.state.keysPressed.RIGHT = false;
          break;
        case 38:
          this.state.keysPressed.UP = false;
          break;
        case 27:
          this.state.keysPressed.ESC = false;
          break;
      }

      if (evt.shiftKey) {
        this.state.keysPressed.SHIFT = false;
      }
    },

    /** @private */
    _initializeGameListeners: function() {
      window.addEventListener('keydown', this._onKeyDown);
      window.addEventListener('keyup', this._onKeyUp);
    },

    /** @private */
    _removeGameListeners: function() {
      window.removeEventListener('keydown', this._onKeyDown);
      window.removeEventListener('keyup', this._onKeyUp);
    }
  };

  window.Game = Game;
  window.Game.Verdict = Verdict;

  var game = new Game(gameBlock);
  game.initializeLevelAndStart();
  // game.setGameStatus(window.Game.Verdict.INTRO);
})();


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Gallery = __webpack_require__(6);
var Photo = __webpack_require__(7);

(function() {
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

})();


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var Review = __webpack_require__(8);

(function() {
  var reviewFilter = document.querySelector('.reviews-filter');
  var reviewsBlock = document.querySelector('.reviews');
  // Блок для вывода созданных элементов
  var container = document.querySelector('.reviews-list');
  var reviews = [];
  var filteredReviews = [];
  var currentPage = 0;
  var PAGE_SIZE = 3;
  // Кнопка Еще отзывы
  var moreReviewsButton = document.querySelector('.reviews-controls-more');

  // Делегирование

  var filters = document.querySelector('.reviews-filter');
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('reviews-filter-item')) {
      setActiveFilter(clickedElement.htmlFor);
    }
  });

  // Кнопка Еще отзывы

  moreReviewsButton.addEventListener('click', function() {
    renderReviews(filteredReviews, ++currentPage);
  });

  // Спрятать блок с фильтрами

  reviewFilter.classList.add('invisible');

  // Вызов функции получения отзывов через http

  getReviews();

  // Отрисовка списка отзывов

  function renderReviews(reviewsArray, pageNumber, replace) {
    // Перезаписывать содержимое контейнера
    if (replace) {
      currentPage = 0;
      // Удаление каждого из элементов через вызов removeChild
      var renderedReviews = container.querySelectorAll('.review');
      [].forEach.call(renderedReviews, function(elem) {
        container.removeChild(elem);
      });
    }
    // Оптимизация отрисовки списка отзывов
    var fragment = document.createDocumentFragment();
    // Для постраничного вывода отзывов
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageReviews = reviewsArray.slice(from, to);
    // Непосредственно отрисовка отзывов
    pageReviews.forEach(function(review) {
      // Отрисовка каждого отзыва
      var reviewElement = new Review(review);
      reviewElement.render();
      fragment.appendChild(reviewElement.element);
    });
    container.appendChild(fragment);
    reviewsBlock.classList.remove('reviews-list-loading');
    // Определяем, когда показывать кнопку Еще отзывы
    if (to < filteredReviews.length) {
      moreReviewsButton.classList.remove('invisible');
    } else {
      moreReviewsButton.classList.add('invisible');
    }
  }

  //Фильтры

  function setActiveFilter(id) {

    // Отсортировать и отфильтровать
    filteredReviews = reviews.slice(0);

    switch (id) {
      case 'reviews-all':
        break;
      // Фильтр Недавние — показывает список отзывов, оставленных за две недели, отсортированных по убыванию даты (поле date)
      case 'reviews-recent':
        filteredReviews = filteredReviews.filter(function(elem) {
          var dateTwoWeeksAgo = new Date(elem.date);
          var nowDate = new Date();
          return dateTwoWeeksAgo > nowDate - 14 * 24 * 60 * 60 * 1000;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          var date1 = new Date(a.date);
          var date2 = new Date(b.date);
          return date2 - date1;
        });
        break;
      // Фильтр Хорошие — с рейтингом не ниже 3, отсортированные по убыванию рейтинга (поле rating)
      case 'reviews-good':
        filteredReviews = filteredReviews.filter(function(elem) {
          return elem.rating >= 3;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b.rating - a.rating;
        });
        break;
      // Фильтр Плохие — с рейтингом не выше 2, отсортированные по возрастанию рейтинга
      case 'reviews-bad':
        filteredReviews = filteredReviews.filter(function(elem) {
          return elem.rating < 3;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          return a.rating - b.rating;
        });
        break;
      // Фильтр Популярные — отсортированные по убыванию оценки отзыва (поле review_usefulness)
      case 'reviews-popular':
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b.review_usefulness - a.review_usefulness;
        });
        break;
    }
    renderReviews(filteredReviews, 0, true);
    // console.log('страница ' + currentPage); //для проверки
  }

  // Получение данных по http

  function getReviews() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//o0.github.io/assets/json/reviews.json');
    xhr.onload = function(evt) {
      reviewsBlock.classList.add('reviews-list-loading');
      var rawData = evt.target.response;
      var loadedReviews = JSON.parse(rawData);
      reviews = loadedReviews;
      filteredReviews = loadedReviews;

      // Обработка загруженных данных
      renderReviews(filteredReviews, 0, true);
    };
    xhr.onerror = function() {
      reviewsBlock.classList.add('reviews-load-failure');
    };
    xhr.send();
  }

  reviewFilter.classList.remove('invisible');

})();


/***/ },
/* 6 */
/***/ function(module, exports) {

"use strict";
'use strict';

(function() {
  var Gallery = function() {
    this.element = document.querySelector('.overlay-gallery');
    this._closeButton = document.querySelector('.overlay-gallery-close');
    this._onCloseClick = this._onCloseClick.bind(this);
    this._controls = document.querySelector('.overlay-gallery-controls');
    this._controlLeft = document.querySelector('.overlay-gallery-control-left');
    this._controlRight = document.querySelector('.overlay-gallery-control-right');
    this._controlLeftClick = this._controlLeftClick.bind(this);
    this._controlRightClick = this._controlRightClick.bind(this);
    this._onKeyClick = this._onKeyClick.bind(this);
    this.previewNumberCurrent = document.querySelector('.preview-number-current');
    this.previewNumberTotal = document.querySelector('.preview-number-total');
  };

  // Чтобы потом пользоваться массивом, его надо определить

  Gallery.prototype.array = [];

  // Показать галерею

  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');

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
  // с переданным индексом из массива фотографий и отрисовывает ее в галерее

  Gallery.prototype.setCurrentPicture = function(number) {
    this.currentNumber = number;
    var image = new Image();
    var imageContainer = this.element.querySelector('.overlay-gallery-preview');
    if (number < this.array.length) {
      imageContainer.removeChild(imageContainer.lastChild);
      image.src = this.array[number].src;
      image.height = 500;
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
  };

  Gallery.prototype._controlLeftClick = function() {
    if (this.currentNumber >= 1) {
      this.setCurrentPicture(this.currentNumber - 1);
    }
  };

  Gallery.prototype._controlRightClick = function() {
    if (this.currentNumber < this.array.length - 1) {
      this.setCurrentPicture(this.currentNumber + 1);
    }
  };

  Gallery.prototype._onKeyClick = function(e) {
    switch (e.keyCode) {
      case 27:
        this.hide();
        break;
      case 37:
        this._controlLeftClick();
        break;
      case 39:
        this._controlRightClick();
        break;
    }
  };

  module.exports = Gallery;

  // window.Gallery = Gallery;
})();


/***/ },
/* 7 */
/***/ function(module, exports) {

"use strict";
'use strict';

(function() {
  var Photo = function(src) {
    this.src = src;
  };

  module.exports = Photo;
})();


/***/ },
/* 8 */
/***/ function(module, exports) {

"use strict";
'use strict';

(function() {
  function Review(data) {
    this._data = data;
  }

  // Получить объект из шаблона
  Review.prototype.render = function() {
    // Копируем getElementFromTemplate, которая раньше была в reviews.js
    var template = document.querySelector('#review-template');
    // Для IE
    if ('content' in template) {
      this.element = template.content.children[0].cloneNode(true);
    } else {
      this.element = template.children[0].cloneNode(true);
    }

    // Данные из шаблона на сервере

    this.element.querySelector('.review-text').textContent = this._data.description;
    var userImage = new Image(124, 124);
    userImage.src = this._data.author.picture;
    userImage.title = this._data.author.name;
    setRating(this.element, this._data.rating);

    // Обработчик загрузки

    userImage.onload = function() {
      this.element.replaceChild(userImage, this.element.querySelector('.review-author'));
    }.bind(this);

    // Чтобы новое изображение было правильно расположено относительно блока отзыва
    userImage.classList.add('review-author');

    // Обработчик ошибки

    userImage.onerror = function() {
      this.element.classList.add('review-load-failure');
    }.bind(this);
  };

  var ratingArray = {
    1: null,
    2: 'review-rating-two',
    3: 'review-rating-three',
    4: 'review-rating-four',
    5: 'review-rating-five'
  };

  function setRating(element, rate) {
    element.querySelector('.review-rating').classList.add(ratingArray[rate]);
  }

  module.exports = Review;
})();


/***/ },
/* 9 */
/***/ function(module, exports) {

/**
 * @fileoverview Библиотека для удобной работы с cookie.
 */

var docCookies = {
  /**
   * Возвращает значение cookie с переданным ключом sKey.
   * @param {string} sKey
   * @return {string}
   */
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },

  /**
   * Устанавливает cookie с названием sKey и значением sValue. Остальные параметры
   * необязательны и используются для более точного задания параметров cookie:
   * срок жизни cookie, домен и путь. bSecure указывает что cookie можно передавать
   * только по безопасному соединению.
   * @param {string} sKey
   * @param {string} sValue
   * @param {number|Date|string=} vEnd Срок жизни cookie. Может передаваться
   *     как дата, строка или число.
   * @param {string=} sPath
   * @param {string=} sDomain
   * @param {boolean=} bSecure
   */
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = !isFinite(vEnd) ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + (vEnd / 1000);
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },

  /**
   * Удаляет cookie по переданному ключу. sPath и sDomain необязательные параметры.
   * @param {string} sKey
   * @param {string} sPath
   * @param {string} sDomain
   * @return {boolean} Ключ, успешно ли произошло удаление. Равен false, если cookie
   *     с таким названием нет.
   */
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },

  /**
   * Проверяет, действительно ли существует cookie с переданным названием.
   * @param {string} sKey
   * @return {boolean}
   */
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },

  /**
   * Возвращает все ключи, установленных cookie.
   * @return {Array.<string>}
   */
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

module.exports = docCookies;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

__webpack_require__(0);
__webpack_require__(1);
__webpack_require__(3);
__webpack_require__(2);
__webpack_require__(4);
__webpack_require__(5);


/***/ }
/******/ ]);