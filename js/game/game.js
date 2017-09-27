'use strict';

var utils = require('../base/utils');
var ObjectsBehaviour = require('./objects-behaviour');
var levels = require('./levels');

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

  _initializeGameListeners: function() {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  },

  _removeGameListeners: function() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
  }
};

Game.Verdict = utils.Verdict;

var game = new Game(document.querySelector('.demo'));
game.initializeLevelAndStart();
game.setGameStatus(Game.Verdict.INTRO);

module.exports = game;
