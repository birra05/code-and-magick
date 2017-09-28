var utils = require('../base/utils');

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
