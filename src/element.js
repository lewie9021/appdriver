const commands = require("./commands");
const { ElementActionError } = require("./errors");
const { delay } = require("./utils");

const poll = (func, maxRetries = 10) => {
  return func()
    .catch((err) => {
      if (maxRetries <= 1) {
        throw err
      }

      return delay(1000)
        .then(() => poll(func, maxRetries - 1));
    });
};

const pollDisplayed = (elementId) => {
  return poll(() => {
    return commands.element.attributes.displayed(elementId)
      .then((x) => {
        if (!x.value) {
          throw new Error("Element not displayed");
        }

        return x;
      });
  });
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
  });
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

  tap() {
    return this._executeAction(({status, value}, done) => {
      if (value.status === 7) {
        throw new Error("Can't tap element that doesn't exist");
      }

      commands.element.actions.click(value.ELEMENT)
        .then(() => done(null))
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
    const currentValue = getValue(this.matcher, this.value);

    this.value = new Promise((resolve, reject) => {
      currentValue.then((value) => {
        if (value.status === 7) {
          throw new Error("Can't tap element that doesn't exist");
        }

        commands.element.actions.sendKeys(value.value.ELEMENT, text.split(""))
          .then(({status}) => {
            if (status === 13 && global.session.platformName === "iOS") {
              throw new Error("Failed to type text. Please make sure input via your computer's keyboard is disabled");
            }

            if (status !== 0) {
              throw new Error("Failed to type text");
            }

            return resolve(value);
          });
      }, reject);
    });

    return this;
  }

  clearText() {
    const currentValue = getValue(this.matcher, this.value);

    this.value = new Promise((resolve, reject) => {
      currentValue.then((value) => {
        if (value.status === 7) {
          throw new Error("Can't tap element that doesn't exist");
        }

        commands.element.actions.clearElement(value.value.ELEMENT)
          .then(({status}) => {
            if (status !== 0) {
              throw new Error("Failed to clear text");
            }

            return resolve(value);
          });
      }, reject);
    });

    return this;
  }

  // NOTE: NOT SUPPORTED!
  _getElementId() {
    return this.value.then((value) => {
      return value.value.ELEMENT;
    })
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
        throw new Error("Can't get size of element that doesn't exist");
      }

      const command = relative
        ? commands.element.attributes.locationInView(value.value.ELEMENT)
        : commands.element.attributes.location(value.value.ELEMENT);

      return command.then(({status, value}) => {
        if (status !== 0) {
          throw new Error(`Failed to get element ${relative ? "relative " : ""}location`);
        }

        return value;
      });
    });
  }

  waitToBeVisible(matcher) {
    const currentValue = getValue(this.matcher, this.value);

    this.value = new Promise((resolve, reject) => {
      currentValue.then((response) => {
        if (response.status !== 0) { // Initial find didn't work or a previously chained call failed.
          return pollExist(matcher)
            .then(({value}) => {
              return pollDisplayed(value.ELEMENT)
                .then((res) => resolve(res));
            });
        }

        return pollDisplayed(response.value.ELEMENT)
          .then(() => resolve(response));
      }, reject);
    });

    return this;
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