const { sessionStore } = require("./stores/sessionStore");
const { createAppiumService } = require("./services/appiumService");
const gestures = require("./gestures");
const { Expect } = require("./Expect");
const { ElementNotFoundError, ElementActionError, ElementWaitError, AppiumError } = require("./errors");
const { isInstanceOf, isNull, pollFor, delay, toBoolean, toNumber, platform } = require("./utils");
const { transformBounds } = require("./attributeTransforms");

const appiumService = createAppiumService(sessionStore);

const poll = (func, opts) => {
  return func()
    .catch(() => {
      return delay(opts.interval)
        .then(() => poll(func, opts));
    });
};

const getCurrentValue = (elementValue) => {
  return elementValue
    .catch((err) => {
      if (isInstanceOf(err, ElementNotFoundError) && err.matcher) {
        return appiumService.findElement({ matcher: err.matcher })
          .then((ref) => ({ ref, matcher: err.matcher }))
          .catch(() => {
            throw new ElementNotFoundError("Failed to find element", err.matcher);
          });
      }

      throw err;
    })
    .then((value) => {
      if (isNull(value.ref) && value.matcher) {
        return appiumService.findElement({ matcher: value.matcher })
          .then((ref) => ({ ref, matcher: value.matcher }))
          .catch(() => {
            throw new ElementNotFoundError("Failed to find element", value.matcher);
          });
      }

      return value;
    });
};

const parseValue = (rawValue, elementType, options) => {
  switch (elementType) {
    case "XCUIElementTypeTextField":
      return rawValue || "";
    case "XCUIElementTypeSwitch":
      return rawValue === "1";
    case "XCUIElementTypeButton":
      // Possibly a switch?
      if (rawValue === "1" || rawValue === "0") {
        return Boolean(parseInt(rawValue));
      }

      return rawValue;
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
  constructor({ value, thenable = true }) {
    this.value = value;

    if (thenable) {
      this.then = function(onResolved, onRejected) {
        return this.value.then((value) => {
          onResolved(new Element({ value: Promise.resolve(value), thenable: false }));
        }, onRejected);
      };
    }
  }

  _executeAction(action) {
    const currentValue = getCurrentValue(this.value);

    const nextValue = new Promise((resolve, reject) => {
      currentValue
        .then((value) => {
          const done = (err) => {
            if (err) {
              return reject(err);
            }

            resolve(value);
          };

          action(value, done);
        })
        .catch(reject);
    });

    return new Element({ value: nextValue });
  }

  _executeWait(conditionFn, maxDuration, interval, timeoutError) {
    const currentValue = getCurrentValue(this.value);
    let $element;

    const nextValue = new Promise((resolve, reject) => {
      currentValue.then(
        (value) => {
          pollFor(() => {
            $element = new Element({ value: Promise.resolve(value) });

            return conditionFn($element);
          }, { maxDuration, interval })
            .then(() => resolve(value))
            .catch((errors) => {
              reject(new ElementWaitError(timeoutError));
            });
        },
        (err) => {
          if (isInstanceOf(err, ElementNotFoundError) && err.matcher) {
            return pollFor(() => {
              $element = new Element({ value: Promise.resolve({ matcher: err.matcher, ref: null }) });

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

    return new Element({ value: nextValue });
  }

  _getRef() {
    return getCurrentValue(this.value)
      .then((value) => value.ref);
  }

  findElement(matcher) {
    const currentValue = getCurrentValue(this.value);

    const nextValue = new Promise((resolve, reject) => {
      currentValue.then(
        (value) => {
          if (!value.ref) {
            throw new ElementActionError("Failed to find element from element that doesn't exist.");
          }

          return appiumService.findElement({ matcher, element: value.ref })
            .then((ref) => resolve({ matcher, ref }));
        },
        (err) => reject(err)
      );
    });

    return new Element({ value: nextValue });
  }

  findElements(matcher) {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => {
        if (!value.ref) {
          throw new ElementActionError("Failed to find elements from element that doesn't exist.");
        }

        return appiumService.findElements({ element: value.ref, matcher })
          .then((refs) => {
            return refs.map((ref) => {
              return new Element({ value: Promise.resolve({ ref, matcher: null }) });
            });
          });
      })
      .catch((err) => {
        throw new ElementActionError(err.message);
      });
  }

  tap({ x = 0, y = 0 } = {}) {
    return this._executeAction((value, done) => {
      if (!value.ref) {
        return done(new ElementActionError("Failed to tap element that doesn't exist."));
      }

      const $element = new Element({ value: Promise.resolve(value) });

      return gestures.tap({ x, y, element: $element })
        .resolve()
        .then((actions) => {
          appiumService.performActions({ actions })
            .then(() => done(null))
            .catch(() => done(new ElementActionError("Failed to tap element.")));
        })
        .catch((err) => done(err));
    });
  }

  longPress({ x = 0, y = 0, duration = 750 } = {}) {
    return this._executeAction((value, done) => {
      if (!value.ref) {
        return done(new ElementActionError("Failed to long press element that doesn't exist."));
      }

      const $element = new Element({ value: Promise.resolve(value) });

      return gestures.longPress({x, y, duration, element: $element})
        .resolve()
        .then((actions) => {
          appiumService.performActions({ actions })
            .then(() => done(null))
            .catch(() => done(new ElementActionError("Failed to long press element.")));
          })
          .catch((err) => done(err));
    });
  }

  typeText(text) {
    return this._executeAction((value, done) => {
      if (!value.ref) {
        return done(new ElementActionError("Can't type text on element that doesn't exist"));
      }

      if (typeof text !== "string") {
        return done(new ElementActionError(`Failed to type text. 'text' must be a string, instead got ${typeof text}.`));
      }

      return appiumService.sendElementKeys({ element: value.ref, keys: text.split("") })
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            if (err.status === 13 && sessionStore.getCapabilities("platformName") === "iOS") {
              return done(new ElementActionError("Failed to type text. Make sure hardware keyboard is disconnected from iOS simulator."));
            }
          }

          return done(new ElementActionError("Failed to type text on element."));
        });
    });
  }

  clearText() {
    return this._executeAction((value, done) => {
      if (!value.ref) {
        return done(new ElementActionError("Failed to clear text for element that doesn't exist."));
      }

      return appiumService.clearElementText({ element: value.ref })
        .then(() => done(null))
        .catch(() => done(new ElementActionError("Failed to clear text on element.")));
    });
  }

  getSize() {
    const currentValue = getCurrentValue(this.value);

    return currentValue.then((value) => {
      if (!value.ref) {
        throw new ElementActionError("Failed to get size of element that doesn't exist.");
      }

      return appiumService.getElementSize({ element: value.ref })
        .catch(() => {
          throw new ElementActionError("Failed to get size of element.")
        });
    });
  }

  getAttribute(name) {
    const currentValue = getCurrentValue(this.value);
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
        // { name: "password" }, // Doesn't seem to work.
        { name: "resourceId" },
        { name: "scrollable", transform: toBoolean },
        { name: "selectionStart", internalName: "selection-start", transform: toNumber },
        { name: "selectionEnd", internalName: "selection-end", transform: toNumber },
        { name: "selected", transform: toBoolean },
        { name: "text" },
        { name: "bounds", transform: transformBounds },
        { name: "displayed", transform: toBoolean },
        { name: "contentSize", transform: JSON.parse } // Only works on ScrollViews
      ]
    });

    return currentValue.then((value) => {
      if (!value.ref) {
        throw new ElementActionError("Failed to get attribute of element that doesn't exist.");
      }

      const attribute = validAttributes.find((x) => x.name === name);

      if (!attribute) {
        throw new ElementActionError(`Invalid attribute.\n\nValid attributes are:\n\n${validAttributes.map((x) => `- ${x.name}`).join("\n")}`);
      }

      return appiumService.getElementAttribute({ element: value.ref, attribute: attribute.internalName || attribute.name })
        .then(attribute.transform)
        .catch(() => {
          throw new ElementActionError("Failed to get element attribute.");
        });
    });
  }

  getLocation({relative = false} = {}) {
    const currentValue = getCurrentValue(this.value);

    return currentValue.then((value) => {
      if (!value.ref) {
        throw new ElementActionError("Failed to get location of element that doesn't exist.");
      }

      return appiumService.getElementLocation({ element: value.ref, relative })
        .catch(() => {
          throw new ElementActionError("Failed to get location of element.");
        });
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
    const conditionFn = ($e) => new Expect($e.isVisible()).toEqual(true);
    const timeoutError = `Element not visible after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutError);
  }

  waitToBeInvisible(options = {}) {
    const maxDuration = options.maxDuration || 5000;
    const interval = options.interval || 200;
    const conditionFn = ($e) => new Expect($e.isVisible()).toEqual(false);
    const timeoutError = `Element still visible after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutError);
  }

  waitToExist(options = {}) {
    const maxDuration = options.maxDuration || 5000;
    const interval = options.interval || 200;
    const conditionFn = ($e) => new Expect($e.exists()).toEqual(true);
    const timeoutError = `Element not found after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutError);
  }

  waitToNotExist(options = {}) {
    const maxDuration = options.maxDuration || 5000;
    const interval = options.interval || 200;
    const conditionFn = ($e) => new Expect($e.exists()).toEqual(false);
    const timeoutError = `Element still found after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutError);
  }

  getText() {
    const currentValue = getCurrentValue(this.value);

    return currentValue.then((value) => {
      return platform.select({
        ios: () => {
          return appiumService.getElementType({ element: value.ref })
            .then((elementType) => {
              if (elementType === "XCUIElementTypeStaticText") {
                return appiumService.getElementText({ element: value.ref });
              }

              return appiumService.getElementText({ element: value.ref })
                .then((text) => {
                  if (text) {
                    return text;
                  }

                  const matcher = {
                    using: "-ios predicate string",
                    value: `type == "XCUIElementTypeStaticText"`
                  };

                  return appiumService.findElements({ element: value.ref, matcher })
                    .then((refs) => {
                      const tasks = refs.map((ref) => appiumService.getElementText({ element: ref }));

                      return Promise.all(tasks)
                        .then((textFragments) => textFragments.join(" "));
                    });
                });
            })
            .catch(() => {
              throw new ElementActionError("Failed to get text of element.");
            });
        },
        android: () => {
          return appiumService.getElementType({ element: value.ref })
            .then((elementType) => {
              if (elementType === "android.widget.TextView") {
                return appiumService.getElementText({ element: value.ref });
              }

              const matcher = {
                using: "class name",
                value: "android.widget.TextView"
              };

              return appiumService.findElements({ element: value.ref, matcher })
                .then((refs) => {
                  const tasks = refs.map((ref) => appiumService.getElementText({ element: ref }));

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
    const currentValue = getCurrentValue(this.value);

    return currentValue.then((value) => {
      const tasks = [
        appiumService.getElementType({ element: value.ref }),
        appiumService.getElementValue({ element: value.ref })
      ];

      return Promise.all(tasks)
        .then(([ type, value ]) => parseValue(value, type, options))
        .catch(() => {
          throw new ElementActionError("Failed to get value of element.");
        });
    });
  }

  exists() {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => {
        if (!value.ref) {
          return false;
        }

        return appiumService.getElementType({ element: value.ref })
          .then(() => true)
          .catch(() => false);
      })
      .catch((err) => {
        if (isInstanceOf(err, ElementNotFoundError)) {
          return false;
        }

        throw err;
      });
  }

  isVisible() {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => {
        return appiumService.getElementVisible({ element: value.ref })
      })
      .catch((err) => {
        if (isInstanceOf(err, ElementNotFoundError)) {
          return false;
        }

        throw new ElementActionError("Failed to retrieve visibility status of element.");
      });
  }

  isDisabled() {
    const currentValue = getCurrentValue(this.value);

    return currentValue.then((value) => {
      if (!value.ref) {
        throw new ElementActionError("Failed to retrieve disabled status of element that doesn't exist.");
      }

      return appiumService.getElementDisabled({ element: value.ref })
        .catch(() => {
          throw new ElementActionError("Failed to retrieve disabled status of element.");
        });
    });
  }

  swipe({ x = 0, y = 0, distance, direction, duration }) {
    return this._executeAction((value, done) => {
      if (!value.ref) {
        return done(new ElementActionError("Can't swipe on element that doesn't exist"));
      }

      const $element = new Element({ value: Promise.resolve(value) });

      return gestures.swipe({ x, y, distance, direction, duration, element: $element })
        .resolve()
        .then((actions) => {
          appiumService.performActions({ actions })
            .then(() => done(null))
            .catch(() => done(new ElementActionError("Failed to swipe on element.")));
        })
        .catch((err) => done(err));
    });
  }

  swipeUp({ x = 0, y = 0, distance, percentage, duration }) {
    return this._executeAction((value, done) => {
      if (!value.ref) {
        return done(new ElementActionError("Can't swipe up on element that doesn't exist"));
      }

      const $element = new Element({ value: Promise.resolve(value) });

      const resolveSwipeDistance = () => {
        if (!percentage) {
          return Promise.resolve(distance);
        }

        return this.getSize()
          .then((size) => size.height * percentage);
      };

      return resolveSwipeDistance()
        .then((swipeDistance) => {
          return gestures.swipeUp({ x, y, distance: swipeDistance, duration, element: $element })
            .resolve();
        })
        .then((actions) => {
          appiumService.performActions({ actions })
            .then(() => done(null))
            .catch(() => done(new ElementActionError("Failed to swipe up on element.")));
        })
        .catch((err) => done(err));
    });
  }

  swipeDown({ x = 0, y = 0, distance, percentage, duration }) {
    return this._executeAction((value, done) => {
      if (!value.ref) {
        return done(new ElementActionError("Can't swipe down on element that doesn't exist"));
      }

      const $element = new Element({ value: Promise.resolve(value) });

      const resolveSwipeDistance = () => {
        if (!percentage) {
          return Promise.resolve(distance);
        }

        return this.getSize()
          .then((size) => size.height * percentage);
      };

      return resolveSwipeDistance()
        .then((swipeDistance) => {
          return gestures.swipeDown({ x, y, distance: swipeDistance, duration, element: $element })
            .resolve();
        })
        .then((actions) => {
          appiumService.performActions({ actions })
            .then(() => done(null))
            .catch(() => done(new ElementActionError("Failed to swipe down on element.")));
        })
        .catch((err) => done(err));
    });
  }

  swipeLeft({ x = 0, y = 0, distance, percentage, duration }) {
    return this._executeAction((value, done) => {
      if (!value.ref) {
        return done(new ElementActionError("Can't swipe left on element that doesn't exist"));
      }

      const $element = new Element({ value: Promise.resolve(value) });

      const resolveSwipeDistance = () => {
        if (!percentage) {
          return Promise.resolve(distance);
        }

        return this.getSize()
          .then((size) => size.width * percentage);
      };

      return resolveSwipeDistance()
        .then((swipeDistance) => {
          return gestures.swipeLeft({ x, y, distance: swipeDistance, duration, element: $element })
            .resolve();
        })
        .then((actions) => {
          appiumService.performActions({ actions })
            .then(() => done(null))
            .catch(() => done(new ElementActionError("Failed to swipe left on element.")));
        })
        .catch((err) => done(err));
    });
  }

  swipeRight({ x = 0, y = 0, distance, percentage, duration }) {
    return this._executeAction((value, done) => {
      if (!value.ref) {
        return done(new ElementActionError("Can't swipe right on element that doesn't exist"));
      }

      const $element = new Element({ value: Promise.resolve(value) });

      const resolveSwipeDistance = () => {
        if (!percentage) {
          return Promise.resolve(distance);
        }

        return this.getSize()
          .then((size) => size.width * percentage);
      };

      return resolveSwipeDistance()
        .then((swipeDistance) => {
          return gestures.swipeRight({ x, y, distance: swipeDistance, duration, element: $element })
            .resolve();
        })
        .then((actions) => {
          appiumService.performActions({ actions })
            .then(() => done(null))
            .catch(() => done(new ElementActionError("Failed to swipe right on element.")));
        })
        .catch((err) => done(err));
    });
  }
}

module.exports = {
  Element
};