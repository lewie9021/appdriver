const commands = require("./commands");
const { sessionStore } = require("./stores/sessionStore");
const { createAppiumService } = require("./services/appiumService");
const gestures = require("./gestures");
const expect = require("./expect");
const { ElementNotFoundError, ElementActionError, ElementWaitError, NotImplementedError } = require("./errors");
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

const getValue = (elementValue) => {
  return elementValue.then((value) => {
    if (isNull(value.element)) {
      return appiumService.findElement({ matcher: value.matcher })
        .then((element) => ({ matcher: value.matcher, element }));
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
    // this.matcher = matcher;
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
    const currentValue = getValue(this.value);

    const nextValue = new Promise((resolve, reject) => {
      currentValue.then(
        (value) => {
          const done = (err) => {
            if (err) {
              return reject(err);
            }

            resolve(value);
          };

          action(value, done);
        },
        (err) => {
          if (isInstanceOf(err, ElementNotFoundError)) {
            const done = (err, value) => {
              if (err) {
                return reject(err);
              }

              resolve(value);
            };

            return action(null, done);
          }

          reject(err);
        }
      );
    });

    return new Element({ value: nextValue });
  }

  _executeWait(conditionFn, maxDuration, interval, timeoutError) {
    const currentValue = getValue(this.value);
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
          if (isInstanceOf(err, ElementNotFoundError)) {
            return pollFor(() => {
              $element = new Element({ value: Promise.resolve({ matcher: err.matcher, element: null }) });

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

  _getElementId() {
    return getValue(this.value)
      .then((value) => value.element.ELEMENT);
  }

  findElement(matcher) {
    const currentValue = getValue(this.value);

    const nextValue = new Promise((resolve, reject) => {
      currentValue.then(
        (value) => {
          if (!value.element) {
            throw new ElementActionError("Failed to find element from element that doesn't exist.");
          }

          return appiumService.findElement({ matcher, element: value.element })
            .then((element) => resolve({ matcher, element }));
        },
        (err) => reject(err)
      );
    });

    return new Element({ value: nextValue });
  }

  // findElements(matcher) {
  //   const currentValue = getValue(this.matcher, this.value);
  //
  //   return currentValue
  //     .then((elementId) => {
  //       if (!elementId) {
  //         throw new ElementActionError("Failed to find elements from element that doesn't exist.");
  //       }
  //
  //       return matcher.resolve(true, elementId)
  //         .then((elementIds) => {
  //           const elementMatcher = () => {
  //             throw new NotImplementedError();
  //           };
  //
  //           return elementIds.map((elementId) => {
  //             return new Element({matcher: elementMatcher, value: Promise.resolve(elementId)});
  //           });
  //         });
  //     })
  //     .catch((err) => {
  //       throw new ElementActionError(err.message);
  //     });
  // }

  tap({ x = 0, y = 0 } = {}) {
    return this._executeAction((value, done) => {
      if (!value.element) {
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
    return this._executeAction((elementId, done) => {
      if (!elementId) {
        return done(new ElementActionError("Failed to long press element that doesn't exist."));
      }

      const $element = new Element({ matcher: this.matcher, value: Promise.resolve(elementId) });

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
    const currentValue = getValue(this.value);

    return currentValue.then((value) => {
      return platform.select({
        ios: () => {
          return appiumService.getElementType({ element: value.element })
            .then((elementType) => {
              if (elementType === "XCUIElementTypeStaticText") {
                return appiumService.getElementText({ element: value.element });
              }

              return appiumService.getElementText({ element: value.element })
                .then((text) => {
                  if (text) {
                    return text;
                  }

                  const matcher = {
                    using: "-ios predicate string",
                    value: `type == "XCUIElementTypeStaticText"`
                  };

                  return appiumService.findElements({ element: value.element, matcher })
                    .then((textEls) => {
                      const tasks = textEls.map((element) => appiumService.getElementText({ element }));

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

    return currentValue.then((el) => {
      const tasks = [
        appiumService.getElementType({ element: el }),
        appiumService.getElementValue({ element: el })
      ];

      return Promise.all(tasks)
        .then(([ type, value ]) => {
          return parseValue(value, type, options);
        })
        .catch(() => {
          throw new ElementActionError("Failed to get value for element.");
        });
    });
  }

  // exists() {
  //   const currentValue = getValue(this.matcher, this.value);
  //
  //   return currentValue
  //     .then((elementId) => {
  //       if (!elementId) {
  //         return false;
  //       }
  //
  //       return commands.element.attributes.type(elementId)
  //         .then(() => true)
  //         .catch(() => false);
  //     })
  //     .catch((err) => {
  //       if (isInstanceOf(err, ElementNotFoundError)) {
  //         return this.matcher.resolve()
  //           .then(() => true)
  //           .catch(() => false);
  //       }
  //
  //       throw err;
  //     });
  // }

  isVisible() {
    const currentValue = getValue(this.value);

    return currentValue
      .then((value) => {
        return appiumService.getElementVisible({ element: value.element })
      })
      .catch((err) => {
        if (isInstanceOf(err, ElementNotFoundError)) {
          return false;
        }

        throw new ElementActionError("Failed to retrieve visibility status of element.");
      });
  }

  isDisabled() {
    const currentValue = getValue(this.matcher, this.value);

    return currentValue.then((elementId) => {
      if (!elementId) {
        throw new ElementActionError("Failed to retrieve disabled status of element that doesn't exist.");
      }

      return commands.element.attributes.disabled(elementId);
    });
  }

  swipe({ x = 0, y = 0, distance, direction, duration }) {
    return this._executeAction((elementId, done) => {
      if (!elementId) {
        return done(new ElementActionError("Can't swipe on element that doesn't exist"));
      }

      const $element = new Element({matcher: this.matcher, value: Promise.resolve(elementId)});

      return gestures.swipe({x, y, distance, direction, duration, element: $element})
        .resolve()
        .then((actions) => {
          commands.interactions.actions(actions)
            .then(({status}) => {
              if (status) {
                return done(new ElementActionError("Failed to swipe on element."));
              }

              done(null);
            })
            .catch((err) => done(err));
        })
        .catch((err) => done(err));
    });
  }

  swipeUp({ x = 0, y = 0, distance, percentage, duration }) {
    return this._executeAction((elementId, done) => {
      if (!elementId) {
        return done(new ElementActionError("Can't swipe up on element that doesn't exist"));
      }

      const $element = new Element({matcher: this.matcher, value: Promise.resolve(elementId)});
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
          commands.interactions.actions(actions)
            .then(({status}) => {
              if (status) {
                return done(new ElementActionError("Failed to swipe up on element."));
              }

              done(null);
            })
            .catch((err) => done(err));
        })
        .catch((err) => done(err));
    });
  }

  swipeDown({ x = 0, y = 0, distance, percentage, duration }) {
    return this._executeAction((elementId, done) => {
      if (!elementId) {
        return done(new ElementActionError("Can't swipe down on element that doesn't exist"));
      }

      const $element = new Element({matcher: this.matcher, value: Promise.resolve(elementId)});
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
          commands.interactions.actions(actions)
            .then(({status}) => {
              if (status) {
                return done(new ElementActionError("Failed to swipe down on element."));
              }

              done(null);
            })
            .catch((err) => done(err));
        })
        .catch((err) => done(err));
    });
  }

  swipeLeft({ x = 0, y = 0, distance, percentage, duration }) {
    return this._executeAction((elementId, done) => {
      if (!elementId) {
        return done(new ElementActionError("Can't swipe left on element that doesn't exist"));
      }

      const $element = new Element({matcher: this.matcher, value: Promise.resolve(elementId)});
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
          commands.interactions.actions(actions)
            .then(({status}) => {
              if (status) {
                return done(new ElementActionError("Failed to swipe left on element."));
              }

              done(null);
            })
            .catch((err) => done(err));
        })
        .catch((err) => done(err));
    });
  }

  swipeRight({ x = 0, y = 0, distance, percentage, duration }) {
    return this._executeAction((elementId, done) => {
      if (!elementId) {
        return done(new ElementActionError("Can't swipe right on element that doesn't exist"));
      }

      const $element = new Element({matcher: this.matcher, value: Promise.resolve(elementId)});
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
          commands.interactions.actions(actions)
            .then(({status}) => {
              if (status) {
                return done(new ElementActionError("Failed to swipe right on element."));
              }

              done(null);
            })
            .catch((err) => done(err));
        })
        .catch((err) => done(err));
    });
  }
}

module.exports = {
  Element
};