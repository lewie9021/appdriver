const commands = require("./commands");
const { ElementNotFoundError, ElementActionError } = require("./errors");
const { delay } = require("./utils");

const poll = (func, {maxRetries = 5, interval = 1000, attempts = 0}) => {
  return func(attempts)
    .then((data) => ({attempts: attempts + 1, data}))
    .catch((err) => {
      if (maxRetries <= 1) {
        throw err
      }

      return delay(interval)
        .then(() => poll(func, {
          maxRetries: maxRetries - 1,
          interval,
          attempts: attempts + 1
        }));
    });
};

const pollDisplayed = (elementId, {maxRetries, interval}) => {
  return poll(() => {
    return commands.element.attributes.displayed(elementId)
      .then(({status, value}) => {
        if (status) {
          throw new ElementActionError(`Failed retrieve element's 'displayed' attribute after ${maxRetries} attempts (interval: ${interval}ms).`);
        }

        if (!value) {
          throw new ElementActionError(`Element not visible after ${maxRetries} attempts (interval: ${interval}ms).`);
        }
      })
  }, {maxRetries, interval})
};

const pollExist = (matcher) => {
  return poll(() => {
    return commands.element.findElement({using: matcher.type, value: matcher.value})
      .then((x) => {
        if (x.status) {
          throw new Error("Element doesn't exist");
        }

        return x;
      });
  }, {maxRetries: 10});
};

const getValue = (matcher, value) => {
  return value || matcher.resolve();
};

class Element {
  constructor({matcher, value = null, thenable = true}) {
    this.matcher = matcher;
    this.value = value;

    if (thenable) {
      this.then = function (onResolved, onRejected) {
        const value = getValue(this.matcher, this.value);

        return value.then((value) => {
          const promise = Promise.resolve(value);

          onResolved(new Element({matcher, value: promise, thenable: false}));
        }, onRejected);
      };
    }
  }

  _executeAction(action) {
    const value = getValue(this.matcher, this.value);
    const nextValue = new Promise((resolve, reject) => {
      value.then((value) => {
        action(value, (err) => err ? reject(err) : resolve(value));
      }, reject);
    });

    return new Element({matcher: this.matcher, value: nextValue});
  }

  // NOTE: NOT SUPPORTED!
  // _getElementId() {
  //   return this.value.then((value) => {
  //     return value.value.ELEMENT;
  //   })
  // }

  tap() {
    return this._executeAction(({status, value}, done) => {
      if (status) {
        return done(new Error("Can't tap element that doesn't exist"));
      }

      commands.element.actions.click(value.ELEMENT)
        .then(({status}) => {
          if (status) {
            return done(new ElementActionError("Failed to tap element."));
          }

          done(null);
        })
        .catch((err) => done(err));
    });
  }

  longPress({x = 0, y = 0, duration = 750} = {}) {
    const currentValue = getValue(this.matcher, this.value);

    this.value = new Promise((resolve, reject) => {
      currentValue.then((value) => {
        if (value.status === 7) {
          throw new Error("Can't long press element that doesn't exist");
        }

        const actions = [{
          type: "pointer",
          id: "finger1",
          parameters: {
            pointerType: "touch"
          },
          actions: [
            {type: "pointerMove", duration: 0, origin: {element: value.value.ELEMENT}, x, y},
            {type: "pointerDown", button: 0},
            {type: "pause", duration},
            {type: "pointerUp", button: 0}
          ]
        }];

        commands.interactions.actions(actions)
          .then(({status, value}) => {
            if (status !== 0) {
              throw new Error("Failed to long press element");
            }

            return resolve(value);
          });
      }, reject);
    });

    return this;
  }

  typeText(text) {
    return this._executeAction(({status, value}, done) => {
      if (status) {
        return done(new Error("Can't type text on element that doesn't exist"));
      }

      if (typeof text !== "string") {
        return done(new Error(`Failed to type text. 'text' must be a string, instead got ${typeof text}.`));
      }

      commands.element.actions.sendKeys(value.ELEMENT, text.split(""))
        .then(({status}) => {
          if (status === 13 && global.session.platformName === "iOS") {
            return done(new Error("Failed to type text. Make sure hardware keyboard is disconnected from iOS simulator."));
          }

          if (status) {
            return done(new Error("Failed to type text."));
          }

          done(null);
        })
        .catch((err) => done(err));
    });
  }

  clearText() {
    return this._executeAction(({status, value}, done) => {
      if (status) {
        return done(new Error("Can't clear text on element that doesn't exist"));
      }

      commands.element.actions.clear(value.ELEMENT)
        .then(({status}) => {
          if (status) {
            return done(new ElementActionError("Failed to clear text."));
          }

          done(null);
        })
        .catch((err) => done(err));
    });
  }

  getSize() {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue.then((value) => {
      if (value.status === 7) {
        throw new Error("Can't get size of element that doesn't exist");
      }

      return commands.element.attributes.size(value.value.ELEMENT)
        .then(({status, value}) => {
          if (status !== 0) {
            throw new Error("Failed to get element size");
          }

          return value;
        });
    });
  }

  getLocation({relative = false}) {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue.then((value) => {
      if (value.status === 7) {
        throw new Error("Can't get location of element that doesn't exist.");
      }

      const command = relative
        ? commands.element.attributes.locationInView(value.value.ELEMENT)
        : commands.element.attributes.location(value.value.ELEMENT);

      return command.then(({status, value}) => {
        if (status !== 0) {
          throw new Error(`Failed to get element ${relative ? "relative " : ""}location.`);
        }

        return value;
      });
    });
  }

  waitToBeVisible(options = {}) {
    const maxRetries = options.maxRetries || 5;
    const interval = options.interval || 200;

    const value = getValue(this.matcher, this.value);
    const nextValue = new Promise((resolve, reject) => {
      value.then((element) => {
        pollDisplayed(element.value.ELEMENT, {maxRetries, interval})
          .then(() => resolve(element))
          .catch(reject);
      }, (err) => {
        if (err instanceof ElementNotFoundError) {
          return poll(() => this.matcher.resolve(), {maxRetries, interval})
            .then(({attempts, data}) => {
              return pollDisplayed(data.value.ELEMENT, {maxRetries: maxRetries - attempts, interval})
                .then(() => resolve(data))
            })
            .catch(() => reject(new Error(`Element not visible after ${maxRetries} attempts (interval: ${interval}ms).`)));
        }

        reject(err);
      });
    });

    return new Element({matcher: this.matcher, value: nextValue});
  }

  waitToExist(matcher) {
    const currentValue = getValue(this.matcher, this.value);

    this.value = new Promise((resolve, reject) => {
      currentValue.then((value) => {
        if (value.status === 0) {
          return resolve(value);
        }

        return pollExist(matcher)
          .then(resolve)
          .catch(reject);
      }, reject);
    });

    return this;
  }

  getText() {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue.then((value) => {
      return commands.element.attributes.text(value.value.ELEMENT)
        .then(({status, value}) => {
          if (status) {
            throw new ElementActionError("Failed to get text for element.");
          }

          return value;
        });
    });
  }
}

const element = (matcher) => {
  return new Element({matcher});
};

module.exports = {
  element,
  Element
};