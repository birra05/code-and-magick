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
