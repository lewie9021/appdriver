const commands = require("./commands");
const gestures = require("./gestures");
const expect = require("./expect");
const { ElementNotFoundError, ElementActionError, ElementWaitError, NotImplementedError } = require("./errors");
const { isInstanceOf, isNull, pollFor, delay, toBoolean, toNumber, platform } = require("./utils");
const { transformBounds } = require("./attributeTransforms");

const poll = (func, opts) => {
  return func()
    .catch(() => {
      return delay(opts.interval)
        .then(() => poll(func, opts));
    });
};

const getValue = (matcher, value) => {
  return value.then((elementId) => {
    if (isNull(elementId)) {
      return matcher.resolve();
    }

    return elementId;
  });
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
  constructor({matcher, value = Promise.resolve(null), thenable = true}) {
    this.matcher = matcher;
    this.value = value;

    if (thenable) {
      this.then = function (onResolved, onRejected) {
        return this.value.then((value) => {
          onResolved(new Element({matcher, value: Promise.resolve(value), thenable: false}));
        }, onRejected);
      };
    }
  }

  _executeAction(action) {
    const value = getValue(this.matcher, this.value);

    const nextValue = new Promise((resolve, reject) => {
      value.then(
        (elementId) => {
          const done = (err) => {
            if (err) {
              return reject(err);
            }

            resolve(elementId);
          };

          action(elementId, done);
        },
        (err) => {
          if (isInstanceOf(err, ElementNotFoundError)) {
            const done = (err, elementId) => {
              if (err) {
                return reject(err);
              }

              resolve(elementId);
            };

            return action(null, done);
          }

          reject(err);
        }
      );
    });

    return new Element({matcher: this.matcher, value: nextValue});
  }

  _executeWait(conditionFn, maxDuration, interval, timeoutError) {
    const value = getValue(this.matcher, this.value);
    let $element;

    const nextValue = new Promise((resolve, reject) => {
      value.then(
        (elementId) => {
          pollFor(() => {
            $element = new Element({matcher: this.matcher, value: Promise.resolve(elementId)});

            return conditionFn($element);
          }, { maxDuration, interval })
            .then(() => resolve(elementId))
            .catch((errors) => {
              reject(new ElementWaitError(timeoutError));
            });
        },
        (err) => {
          if (isInstanceOf(err, ElementNotFoundError)) {
            return pollFor(() => {
              $element = new Element({matcher: this.matcher});

              return conditionFn($element);
            }, { maxDuration, interval })
              .then(() => $element.value.then(resolve))
              .catch((errors) => {
                reject(new ElementWaitError(timeoutError));
              });
          }

          reject(err);
        }
      );
    });

    return new Element({matcher: this.matcher, value: nextValue});
  }

  _getElementId() {
    return getValue(this.matcher, this.value);
  }

  findElement(matcher) {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue
      .then((elementId) => {
        if (!elementId) {
          throw new ElementActionError("Failed to find element from element that doesn't exist.");
        }

        return matcher.resolve(false, elementId)
          .then((elementId) => {
            const elementMatcher = () => {
              throw new NotImplementedError();
            };

            return new Element({matcher: elementMatcher, value: Promise.resolve(elementId)});
          });
      })
      .catch((err) => {
        throw new ElementActionError(err.message);
      });
  }

  findElements(matcher) {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue
      .then((elementId) => {
        if (!elementId) {
          throw new ElementActionError("Failed to find elements from element that doesn't exist.");
        }

        return matcher.resolve(true, elementId)
          .then((elementIds) => {
            const elementMatcher = () => {
              throw new NotImplementedError();
            };

            return elementIds.map((elementId) => {
              return new Element({matcher: elementMatcher, value: Promise.resolve(elementId)});
            });
          });
      })
      .catch((err) => {
        throw new ElementActionError(err.message);
      });
  }

  tap() {
    return this._executeAction((elementId, done) => {
      if (!elementId) {
        return done(new ElementActionError("Failed to tap element that doesn't exist."));
      }

      commands.element.actions.click(elementId)
        .then(() => done(null))
        .catch(done);
    });
  }

  longPress({x = 0, y = 0, duration = 750} = {}) {
    return this._executeAction((elementId, done) => {
      if (!elementId) {
        return done(new ElementActionError("Failed to long press element that doesn't exist."));
      }

      const $element = new Element({matcher: this.matcher, value: Promise.resolve(elementId)});

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
    return this._executeAction((elementId, done) => {
      if (!elementId) {
        return done(new ElementActionError("Can't type text on element that doesn't exist"));
      }

      if (typeof text !== "string") {
        return done(new ElementActionError(`Failed to type text. 'text' must be a string, instead got ${typeof text}.`));
      }

      commands.element.actions.sendKeys(elementId, text.split(""))
        .then(() => done(null))
        .catch(done);
    });
  }

  clearText() {
    return this._executeAction((elementId, done) => {
      if (!elementId) {
        return done(new ElementActionError("Failed to clear text for element that doesn't exist."));
      }

      commands.element.actions.clear(elementId)
        .then(() => done(null))
        .catch(done);
    });
  }

  getSize() {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue.then((elementId) => {
      if (!elementId) {
        throw new ElementActionError("Failed to get size of element that doesn't exist.");
      }

      return commands.element.attributes.size(elementId);
    });
  }

  getAttribute(name) {
    const currentValue = getValue(this.matcher, this.value);
    const validAttributes = platform.select({
      ios: () => [
        { name: "uid", internalName: "UID" },
        { name: "accessibilityContainer", transform: toBoolean },
        { name: "accessible", transform: toBoolean },
        { name: "enabled", transform: toBoolean },
        // { name: "frame" }, // 500 error on ScrollView element.
        { name: "label" },
        { name: "name" },
        { name: "rect", transform: JSON.parse },
        { name: "type" },
        { name: "value" },
        { name: "visible", transform: toBoolean }
      ],
      android: () => [
        { name: "checkable", transform: toBoolean },
        { name: "checked", transform: toBoolean },
        { name: "className" },
        { name: "clickable", transform: toBoolean },
        { name: "contentDescription" },
        { name: "enabled", transform: toBoolean },
        { name: "focusable", transform: toBoolean },
        { name: "focused", transform: toBoolean },
        { name: "longClickable", transform: toBoolean },
        { name: "package" },
        { name: "password" }, // Doesn't seem to work.
        { name: "resourceId" },
        { name: "scrollable", transform: toBoolean },
        { name: "selectionStart", internalName: "selection-start", transform: toNumber },
        { name: "selectionEnd", internalName: "selection-end", transform: toNumber },
        { name: "selected", transform: toBoolean },
        { name: "text" },
        { name: "bounds", transform: transformBounds },
        { name: "displayed", transform: toBoolean },
        { name: "contentSize", transform: JSON.parse }
      ]
    });

    return currentValue.then((elementId) => {
      if (!elementId) {
        throw new ElementActionError("Failed to get attribute of element that doesn't exist.");
      }

      const attribute = validAttributes.find((x) => x.name === name);

      if (!attribute) {
        throw new ElementActionError(`Invalid attribute.\n\nValid attributes are:\n\n${validAttributes.map((x) => `- ${x.name}`).join("\n")}`);
      }

      return commands.element.attributes.attribute(elementId, attribute.internalName || attribute.name, attribute.name)
        .then(attribute.transform);
    });
  }

  getLocation({relative = false} = {}) {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue.then((elementId) => {
      if (!elementId) {
        throw new ElementActionError("Failed to get location of element that doesn't exist.");
      }

      return relative
        ? commands.element.attributes.locationInView(elementId)
        : commands.element.attributes.location(elementId);
    });
  }

  waitFor(conditionFn, options = {}) {
    const maxDuration = options.maxDuration || 5000;
    const interval = options.interval || 200;
    const timeoutError = `Wait condition exceeded ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutError);
  }

  waitToBeVisible(options = {}) {
    const maxDuration = options.maxDuration || 5000;
    const interval = options.interval || 200;
    const conditionFn = ($e) => expect($e.isVisible()).toEqual(true);
    const timeoutError = `Element not visible after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutError);
  }

  waitToBeInvisible(options = {}) {
    const maxDuration = options.maxDuration || 5000;
    const interval = options.interval || 200;
    const conditionFn = ($e) => expect($e.isVisible()).toEqual(false);
    const timeoutError = `Element still visible after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutError);
  }

  waitToExist(options = {}) {
    const maxDuration = options.maxDuration || 5000;
    const interval = options.interval || 200;
    const conditionFn = ($e) => expect($e.exists()).toEqual(true);
    const timeoutError = `Element not found after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutError);
  }

  waitToNotExist(options = {}) {
    const maxDuration = options.maxDuration || 5000;
    const interval = options.interval || 200;
    const conditionFn = ($e) => expect($e.exists()).toEqual(false);
    const timeoutError = `Element still found after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutError);
  }

  getText() {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue.then((elementId) => {
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
                      const tasks = textElements.map((elementId) => commands.element.attributes.text(elementId));

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
                  const tasks = textElements.map((elementId) => commands.element.attributes.text(elementId));

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

    return currentValue.then((elementId) => {
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

  exists() {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue
      .then((elementId) => {
        if (!elementId) {
          return false;
        }

        return commands.element.attributes.type(elementId)
          .then(() => true)
          .catch(() => false);
      })
      .catch((err) => {
        if (isInstanceOf(err, ElementNotFoundError)) {
          return this.matcher.resolve()
            .then(() => true)
            .catch(() => false);
        }

        throw err;
      });
  }

  isVisible() {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue
      .then((elementId) => commands.element.attributes.displayed(elementId))
      .catch((err) => {
        if (isInstanceOf(err, ElementNotFoundError)) {
          return false;
        }

        throw new ElementActionError("Failed to retrieve visibility status of element.");
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