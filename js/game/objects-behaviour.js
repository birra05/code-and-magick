var utils = require('../base/utils');

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
