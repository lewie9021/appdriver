class Gesture {
  constructor(inputs) {
    this.inputs = inputs;
  }

  resolve() {
    const maxInputs = this.inputs.reduce((result, actions) => {
      if (actions.length <= result) {
        return result;
      }

      return actions.length;
    }, 0);

    let result = [];
    for (let i = 0; i < maxInputs; i += 1) {
      result[i] = {
        id: `finger${i + 1}`,
        type: "pointer",
        parameters: {
          pointerType: "touch"
        },
        actions: this.inputs.map((actions) => {
          return actions[i]
            ? actions[i]
            : { type: "pause" }
        })
      }
    }

    return result;
  }
}

const getRelativePoint = ({ direction, distance }) => {
  const radians = direction * (Math.PI / 180);
  const x = Math.round(Math.sin(radians) * distance);
  const y = Math.round(Math.cos(radians) * distance);

  return {
    x: x,
    y: y === -0
      ? 0
      : y * -1
  };
};

const press = () => {
  return new Gesture([[{
    type: "pointerDown",
    button: 0
  }]]);
};

const release = () => {
  return new Gesture([[{
    type: "pointerUp",
    button: 0
  }]]);
};

const wait = (duration) => {
  return new Gesture([[{
    type: "pause",
    duration
  }]]);
};

const moveTo = ({ x, y, duration, relative }) => {
  return new Gesture([[{
    type: "pointerMove",
    origin: relative
      ? "pointer"
      : "viewport",
    duration,
    x,
    y
  }]]);
};

const series = (gestures) => {
  return new Gesture(gestures.reduce((result, gesture) => {
    result.push(...gesture.inputs);

    return result;
  }, []));
};

const parallel = (gestures) => {
  // gesture one -> [[moveTo], [press], [wait], [release]]
  // gesture two -> [[moveTo], [press], [wait[, [release[]
  // output -> [[moveTo, moveTo], [press, press], [wait, wait], [release, release]]

  return new Gesture(  gestures.reduce((result, gesture) => {
    gesture.inputs.forEach((actions, index) => {
      if (!result[index]) {
        result[index] = [];
      }

      result[index].push(...actions);
    });

    return result;
  }, []));
};

// (options: Object) => Gesture
const tap = ({ x, y }) => {
  return series([
    moveTo({ x, y }),
    press(),
    wait(100),
    release()
  ]);
};

// (options: Object) => Gesture
const longPress = ({ x, y, duration = 750 }) => {
  return series([
    moveTo({ x, y }),
    press(),
    wait(duration),
    release()
  ]);
};

// (options: Object) => Gesture
// Note: Having type: "pointerMove", origin: "pointer", and duration: <= 10 doesn't work on Android.
const swipe = ({ x, y, direction, distance, duration = 50 }) => {
  const relativePoint = getRelativePoint({ direction, distance });

  return series([
    moveTo({ x, y, }),
    press(),
    wait(250),
    moveTo({ x: relativePoint.x, y: relativePoint.y, relative: true, duration }),
    release()
  ]);
};

// (options: Object) => Gesture
const swipeLeft = ({ x, y, distance, duration = 50 }) => {
  return swipe({ x, y, distance, duration, direction: 270 });
};

// (options: Object) => Gesture
const swipeRight = ({ x, y, distance, duration = 50 }) => {
  return swipe({ x, y, distance, duration, direction: 90 });
};

// (options: Object) => Gesture
const spread = ({ x, y, distance, direction, duration = 200 }) => {
  return parallel([
    swipe({ x, y, distance, direction: direction % 360, duration }),
    swipe({ x, y, distance, direction: (direction + 180) % 360, duration })
  ]);
};

// const gesture = tap({ x: 100, y: 200 });
// const gesture = parallel([
//   tap({ x: 100, y: 200 }),
//   longPress({ x: 300, y: 200 })
// ]);
// const gesture = ({ x, y }) => series([
//   longPress({ x, y }),
//   wait(2000),
//   spread({ x, y, distance: 25, angle: 90 }),
// ]);