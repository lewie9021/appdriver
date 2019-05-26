const commands = require("./commands");
const gestures = require("./gestures");
const { getSession } = require("./session");
const { ElementNotFoundError, ElementActionError } = require("./errors");
const { delay, platform } = require("./utils");

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

const pollExist = (matcher, {maxRetries, interval}) => {
  return poll(() => {
    return matcher.resolve()
      .then((response) => {
        if (response.status) {
          throw new ElementActionError(`Failed retrieve element's 'existence' status after ${maxRetries} attempts (interval: ${interval}ms).`);
        }

        if (!response.value) {
          throw new ElementActionError(`Element not found after ${maxRetries} attempts (interval: ${interval}ms).`);
        }

        return response;
      })
  }, {maxRetries, interval});
};

const getValue = (matcher, value) => {
  return value || matcher.resolve();
};

const parseValue = (rawValue, elementType, options) => {
  switch (elementType) {
    case "XCUIElementTypeTextField":
      return rawValue || "";
    case "XCUIElementTypeSwitch":
      return rawValue === "1";
    case "android.widget.Switch":
      return rawValue === "ON";
    case "XCUIElementTypeSlider":
      if (!options || !options.sliderRange) {
        throw new Error("You must provide a 'sliderRange' option when dealing with slider elements.");
      }

      return ((options.sliderRange[1] - options.sliderRange[0]) * parseFloat(rawValue.replace("%", ""))) / 100;
    case "android.widget.SeekBar":
      return parseFloat(rawValue);
    default:
      return rawValue;
  }
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

  _getElementId() {
    const value = getValue(this.matcher, this.value);

    return value.then((value) => {
      return value.value.ELEMENT;
    });
  }

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
    return this._executeAction((value, done) => {
      const $element = new Element({matcher: this.matcher, value: Promise.resolve(value)});

      return gestures.longPress({x, y, duration, element: $element})
        .resolve()
        .then((actions) => {
          commands.interactions.actions(actions)
            .then(({status}) => {
              if (status) {
              return done(new ElementActionError("Failed to long press element."));
              }

              done(null);
            })
            .catch((err) => done(err));
          })
          .catch((err) => done(err));
    });
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
          if (status === 13 && getSession("platformName") === "iOS") {
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
      return commands.element.attributes.size(value.value.ELEMENT)
        .then(({status, value}) => {
          if (status) {
            throw new Error("Failed to get element size.");
          }

          return value;
        });
    });
  }

  getLocation({relative = false} = {}) {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue.then(({value}) => {
      const command = relative
        ? commands.element.attributes.locationInView(value.ELEMENT)
        : commands.element.attributes.location(value.ELEMENT);

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

  waitToExist(options = {}) {
    const maxRetries = options.maxRetries || 5;
    const interval = options.interval || 200;

    const value = getValue(this.matcher, this.value);
    const nextValue = new Promise((resolve, reject) => {
      value.then(() => {
        pollExist(this.matcher, {maxRetries, interval})
          .then(({data}) => resolve(data))
          .catch(() => reject(new Error(`Element not found after ${maxRetries} attempts (interval: ${interval}ms).`)));
      }, (err) => {
        if (err instanceof ElementNotFoundError) {
          return pollExist(this.matcher, {maxRetries, interval})
            .then(({data}) => resolve(data))
            .catch(() => reject(new Error(`Element not found after ${maxRetries} attempts (interval: ${interval}ms).`)));
        }

        reject(err);
      });
    });

    return new Element({matcher: this.matcher, value: nextValue});
  }

  getText() {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue.then((value) => {
      const elementId = value.value.ELEMENT;

      return platform.select({
        ios: () => {
          return commands.element.attributes.type(elementId)
            .then((elementType) => {
              if (elementType === "XCUIElementTypeStaticText") {
                return commands.element.attributes.text(elementId);
              }

              return commands.element.attributes.text(elementId)
                .then((text) => {
                  if (text) {
                    return text;
                  }

                  const query = {
                    using: "-ios predicate string",
                    value: `type == "XCUIElementTypeStaticText"`
                  };

                  return commands.element.findElementsFromElement(elementId, query)
                    .then((textElements) => {
                      const tasks = textElements.map((x) => commands.element.attributes.text(x.ELEMENT));

                      return Promise.all(tasks)
                        .then((textFragments) => textFragments.join(" "));
                    });
                });
            })
            .catch(() => {
              throw new ElementActionError("Failed to get text for element.");
            });
        },
        android: () => {
          return commands.element.attributes.type(elementId)
            .then((elementType) => {
              if (elementType === "android.widget.TextView") {
                return commands.element.attributes.text(elementId);
              }

              const query = {
                using: "class name",
                value: "android.widget.TextView"
              };

              return commands.element.findElementsFromElement(elementId, query)
                .then((textElements) => {
                  const tasks = textElements.map((x) => commands.element.attributes.text(x.ELEMENT));

                  return Promise.all(tasks)
                    .then((textFragments) => textFragments.join(" "));
                });
            })
            .catch(() => {
              throw new ElementActionError("Failed to get text for element.");
            });
        }
      });
    });
  }

  getValue(options) {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue.then((value) => {
      const elementId = value.value.ELEMENT;

      return commands.element.attributes.type(elementId)
        .then((elementType) => {
          return commands.element.attributes.value(elementId)
            .then(({status, value}) => {
              if (status) {
                throw new ElementActionError("Failed to get value for element.");
              }

              return parseValue(value, elementType, options);
            });
        });
    });
  }

  isVisible() {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue.then((value) => {
      return commands.element.attributes.displayed(value.value.ELEMENT)
        .then(({status, value}) => {
          if (status) {
            throw new ElementActionError("Failed to get visibility status of element.");
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