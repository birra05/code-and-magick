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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

// Общие переменные и конструкторы

// Функция inherit наследует один класс от другого, продлевая цепочку прототипов с использованием пустого конструктора

function inherit(child, parent) {
  function EmptyCtor() {}
  EmptyCtor.prototype = parent.prototype;
  child.prototype = new EmptyCtor();
}

var HEIGHT = 300;
var WIDTH = 700;

var Level = {
  'INTRO': 0,
  'MOVE_LEFT': 1,
  'MOVE_RIGHT': 2,
  'LEVITATE': 3,
  'HIT_THE_MARK': 4
};

var LevelSequence = [
  Level.INTRO
];

var INITIAL_LEVEL = LevelSequence[0];

var ObjectType = {
  'ME': 0,
  'FIREBALL': 1
};

var ObjectState = {
  'OK': 0,
  'DISPOSED': 1
};

var Direction = {
  NULL: 0,
  LEFT: 1,
  RIGHT: 2,
  UP: 4,
  DOWN: 8
};

// ID возможных ответов функций, проверяющих успех прохождения уровня.
// CONTINUE говорит о том, что раунд не закончен и игру нужно продолжать,
// WIN о том, что раунд выигран, FAIL — о поражении. PAUSE о том, что игру
// нужно прервать.

var Verdict = {
  'CONTINUE': 0,
  'WIN': 1,
  'FAIL': 2,
  'PAUSE': 3,
  'INTRO': 4
};

module.exports = {
  inherit: inherit,

  HEIGHT: HEIGHT,
  WIDTH: WIDTH,
  INITIAL_LEVEL: INITIAL_LEVEL,
  Level: Level,
  ObjectType: ObjectType,
  ObjectState: ObjectState,
  Direction: Direction,
  Verdict: Verdict
};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

var Gallery = __webpack_require__(5);
var Photo = __webpack_require__(6);

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);
var ObjectsBehaviour = __webpack_require__(8);
var levels = __webpack_require__(7);

/**
 * Конструктор объекта Game. Создает canvas, добавляет обработчики событий
 * и показывает приветственный экран.
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
   */
  level: utils.INITIAL_LEVEL,

  /**
   * Состояние игры. Описывает местоположение всех объектов на игровой карте
   * и время проведенное на уровне и в игре.
   */
  getInitialState: function() {
    return {
      // Статус игры. Если CONTINUE, то игра продолжается.
      currentStatus: utils.Verdict.CONTINUE,

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
   */
  initializeLevelAndStart: function(level, restart) {
    level = typeof level === 'undefined' ? this.level : level;
    restart = typeof restart === 'undefined' ? true : restart;

    if (restart || !this.state) {
      // При перезапуске уровня, происходит полная перезапись состояния
      // игры из изначального состояния.
      this.state = this.getInitialState();
      this.state = levels.LevelsInitialize[this.level](this.state);
    } else {
      // При продолжении уровня состояние сохраняется, кроме записи о том,
      // что состояние уровня изменилось с паузы на продолжение игры.
      this.state.currentStatus = utils.Verdict.CONTINUE;
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
   */
  _pauseListener: function(evt) {
    if (evt.keyCode === 32) {
      evt.preventDefault();
      var needToRestartTheGame = this.state.currentStatus === utils.Verdict.WIN ||
          this.state.currentStatus === utils.Verdict.FAIL;
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
      case utils.Verdict.WIN:
        this._drawMessage('Вы победили!');
        break;
      case utils.Verdict.FAIL:
        this._drawMessage('Вы проиграли!');
        break;
      case utils.Verdict.PAUSE:
        this._drawMessage('Пауза. Нажмите Пробел для продолжения');
        break;
      case utils.Verdict.INTRO:
        this._drawMessage('Добро пожаловать в игру! Нажмите Пробел для продолжения');
        break;
    }
  },

  /**
   * Предзагрузка необходимых изображений для уровня.
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
   */
  updateObjects: function(delta) {
    // Персонаж.
    var me = this.state.objects.filter(function(object) {
      return object.type === utils.ObjectType.ME;
    })[0];

    // Добавляет на карту файрбол по нажатию на Shift.
    if (this.state.keysPressed.SHIFT) {
      this.state.objects.push({
        direction: me.direction,
        height: 24,
        speed: 5,
        sprite: 'img/fireball.gif',
        type: utils.ObjectType.FIREBALL,
        width: 24,
        x: me.direction & utils.Direction.RIGHT ? me.x + me.width : me.x - 24,
        y: me.y + me.height / 2
      });

      this.state.keysPressed.SHIFT = false;
    }

    this.state.garbage = [];

    // Убирает в garbage не используемые на карте объекты.
    var remainingObjects = this.state.objects.filter(function(object) {
      ObjectsBehaviour[object.type](object, this.state, delta);

      if (object.state === utils.ObjectState.DISPOSED) {
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
    if (this.state.currentStatus !== utils.Verdict.CONTINUE) {
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
         */
        function checkDeath(state) {
          var me = state.objects.filter(function(object) {
            return object.type === utils.ObjectType.ME;
          })[0];

          return me.state === utils.ObjectState.DISPOSED ?
              utils.Verdict.FAIL :
              utils.Verdict.CONTINUE;
        },

        /**
         * Если нажата клавиша Esc игра ставится на паузу.
         * @param {Object} state
         */
        function checkKeys(state) {
          return state.keysPressed.ESC ? utils.Verdict.PAUSE : utils.Verdict.CONTINUE;
        },

        /**
         * Игра прекращается если игрок продолжает играть в нее два часа подряд.
         * @param {Object} state
         */
        function checkTime(state) {
          return Date.now() - state.startTime > 3 * 60 * 1000 ?
              utils.Verdict.FAIL :
              utils.Verdict.CONTINUE;
        }
      ];
    }

    // Проверка всех правил влияющих на уровень. Запускаем цикл проверок
    // по всем универсальным проверкам и проверкам конкретного уровня.
    // Цикл продолжается до тех пор, пока какая-либо из проверок не вернет
    // любое другое состояние кроме CONTINUE или пока не пройдут все
    // проверки. После этого состояние сохраняется.
    var allChecks = this.commonRules.concat(levels.LevelsRules[this.level]);
    var currentCheck = utils.Verdict.CONTINUE;
    var currentRule;

    while (currentCheck === utils.Verdict.CONTINUE && allChecks.length) {
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
    this.ctx.clearRect(0, 0, utils.WIDTH, utils.HEIGHT);

    // Выставление всех элементов, оставшихся в this.state.objects согласно
    // их координатам и направлению.
    this.state.objects.forEach(function(object) {
      if (object.sprite) {
        var image = new Image(object.width, object.height);
        image.src = (object.spriteReversed && object.direction & utils.Direction.LEFT) ?
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
      case utils.Verdict.CONTINUE:
        this.state.lastUpdated = Date.now();
        this.render();
        requestAnimationFrame(function() {
          this.update();
        }.bind(this));
        break;

      case utils.Verdict.WIN:
      case utils.Verdict.FAIL:
      case utils.Verdict.PAUSE:
      case utils.Verdict.INTRO:
      default:
        this.pauseLevel();
        break;
    }
  },

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

  setParallax: function() {
    var clouds = document.querySelector('.header-clouds');
    var gameBlock = document.querySelector('.demo');
    var IMAGE_WIDTH = 1024;
    var scrollTimeout;
    var cloudsStart = (clouds.getBoundingClientRect().width - IMAGE_WIDTH) / 2;

    if (clouds.getBoundingClientRect().bottom > 0) {
      clouds.style.backgroundPosition = cloudsStart - (clouds.getBoundingClientRect().bottom - clouds.getBoundingClientRect().height) + 'px';
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (gameBlock.getBoundingClientRect().bottom <= 0) {
        game.setGameStatus(Game.Verdict.PAUSE);
      }
    }, 100);
  },

  _initializeGameListeners: function() {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('scroll', this.setParallax);
  },

  _removeGameListeners: function() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('scroll', this.setParallax);
  }
};

Game.Verdict = utils.Verdict;

var gameBlock = document.querySelector('.demo');
var game = new Game(gameBlock);
game.initializeLevelAndStart();
game.setGameStatus(Game.Verdict.INTRO);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

var docCookies = __webpack_require__(10);

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

var Review = __webpack_require__(9);

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
  xhr.open('GET', 'data/reviews.json');
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


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ },
/* 6 */
/***/ function(module, exports) {

var Photo = function(src) {
  this.src = src;
};

module.exports = Photo;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

// Правила завершения уровня. Ключами служат ID уровней, значениями функции
// принимающие на вход состояние уровня и возвращающие true, если раунд
// можно завершать или false если нет.

var LevelsRules = {};

// Уровень считается пройденным, если был выпущен файлболл и он улетел
// за экран.

LevelsRules[utils.Level.INTRO] = function(state) {
  var fireballs = state.garbage.filter(function(object) {
    return object.type === utils.ObjectType.FIREBALL;
  });

  return fireballs.length ? utils.Verdict.WIN : utils.Verdict.CONTINUE;
};

// Начальные условия для уровней.

var LevelsInitialize = {};

// Первый уровень.

LevelsInitialize[utils.Level.INTRO] = function(state) {
  state.objects.push(
    // Установка персонажа в начальное положение. Он стоит в крайнем левом
    // углу экрана, глядя вправо. Скорость перемещения персонажа на этом
    // уровне равна 2px за кадр.
    {
      direction: utils.Direction.RIGHT,
      height: 84,
      speed: 2,
      sprite: 'img/wizard.gif',
      spriteReversed: 'img/wizard-reversed.gif',
      state: utils.ObjectState.OK,
      type: utils.ObjectType.ME,
      width: 61,
      x: utils.WIDTH / 3,
      y: utils.HEIGHT - 100
    }
  );

  return state;
};

module.exports = {
  LevelsRules: LevelsRules,
  LevelsInitialize: LevelsInitialize
}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

// Правила перерисовки объектов в зависимости от состояния игры.

var ObjectsBehaviour = {};

// Обновление движения мага. Движение мага зависит от нажатых в данный момент
// стрелок. Маг может двигаться одновременно по горизонтали и по вертикали.
// На движение мага влияет его пересечение с препятствиями.

ObjectsBehaviour[utils.ObjectType.ME] = function(object, state, timeframe) {
  // Пока зажата стрелка вверх, маг сначала поднимается, а потом левитирует
  // в воздухе на определенной высоте.
  // NB! Сложность заключается в том, что поведение описано в координатах
  // канваса, а не координатах, относительно нижней границы игры.
  if (state.keysPressed.UP && object.y > 0) {
    object.direction = object.direction & ~utils.Direction.DOWN;
    object.direction = object.direction | utils.Direction.UP;
    object.y -= object.speed * timeframe * 2;

    if (object.y < 0) {
      object.y = 0;
    }
  }

  // Если стрелка вверх не зажата, а маг находится в воздухе, он плавно
  // опускается на землю.
  if (!state.keysPressed.UP) {
    if (object.y < utils.HEIGHT - object.height) {
      object.direction = object.direction & ~utils.Direction.UP;
      object.direction = object.direction | utils.Direction.DOWN;
      object.y += object.speed * timeframe / 3;
    } else {
      object.Direction = object.direction & ~utils.Direction.DOWN;
    }
  }

  // Если зажата стрелка влево, маг перемещается влево.
  if (state.keysPressed.LEFT) {
    object.direction = object.direction & ~utils.Direction.RIGHT;
    object.direction = object.direction | utils.Direction.LEFT;
    object.x -= object.speed * timeframe;
  }

  // Если зажата стрелка вправо, маг перемещается вправо.
  if (state.keysPressed.RIGHT) {
    object.direction = object.direction & ~utils.Direction.LEFT;
    object.direction = object.direction | utils.Direction.RIGHT;
    object.x += object.speed * timeframe;
  }

  // Ограничения по перемещению по полю. Маг не может выйти за пределы поля.
  if (object.y < 0) {
    object.y = 0;
    object.Direction = object.direction & ~utils.Direction.DOWN;
    object.Direction = object.direction & ~utils.Direction.UP;
  }

  if (object.y > utils.HEIGHT - object.height) {
    object.y = utils.HEIGHT - object.height;
    object.Direction = object.direction & ~utils.Direction.DOWN;
    object.Direction = object.direction & ~utils.Direction.UP;
  }

  if (object.x < 0) {
    object.x = 0;
  }

  if (object.x > utils.WIDTH - object.width) {
    object.x = utils.WIDTH - object.width;
  }
};

// Обновление движения файрбола. Файрбол выпускается в определенном направлении
// и после этого неуправляемо движется по прямой в заданном направлении. Если
// он пролетает весь экран насквозь, он исчезает.

ObjectsBehaviour[utils.ObjectType.FIREBALL] = function(object, state, timeframe) {
  if (object.direction & utils.Direction.LEFT) {
    object.x -= object.speed * timeframe;
    console.log('what');
  }

  if (object.direction & utils.Direction.RIGHT) {
    object.x += object.speed * timeframe;
    console.log('what-2');
  }

  if (object.x < 0 || object.x > utils.WIDTH) {
    object.state = utils.ObjectState.DISPOSED;
    console.log('what-3');
  }
};

module.exports = ObjectsBehaviour;


/***/ },
/* 9 */
/***/ function(module, exports) {

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


/***/ },
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(2);
__webpack_require__(1);
__webpack_require__(4);
__webpack_require__(3);


/***/ }
/******/ ]);