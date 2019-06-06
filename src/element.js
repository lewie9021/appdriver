const commands = require("./commands");
const gestures = require("./gestures");
const { getSession } = require("./session");
const expect = require("./expect");
const { ElementNotFoundError, ElementActionError, ElementWaitError } = require("./errors");
const { isInstanceOf, isNull, pollFor, delay, platform } = require("./utils");

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

const pollV2 = (func, opts) => {
  return func()
    .catch(() => {
      return delay(opts.interval)
        .then(() => pollV2(func, opts));
    });
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

  _getElementId() {
    return getValue(this.matcher, this.value);
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

    // const maxDuration = options.maxDuration || 5000;
    // const interval = options.interval || 200;
    // const value = getValue(this.matcher, this.value);
    //
    // const nextValue = new Promise((resolve, reject) => {
    //   value.then(
    //     (element) => {
    //       const $element = new Element({matcher: this.matcher, value});
    //
    //       Promise.race([
    //         pollV2(() => fn($element), {interval}),
    //         delay(maxDuration).then(() => {
    //           throw new ElementWaitError(`wait condition exceeded ${maxDuration}ms timeout (interval: ${interval}ms).`);
    //         })
    //       ])
    //         .then(() => resolve(element))
    //         .catch(reject);
    //     },
    //     (err) => {
    //       if (isInstanceOf(err, ElementNotFoundError)) {
    //         let $element;
    //
    //         return Promise.race([
    //           pollV2(() => {
    //             $element = new Element({matcher: this.matcher});
    //
    //             return fn($element);
    //           }, {interval}),
    //           delay(maxDuration).then(() => {
    //             return Promise.reject(new ElementWaitError(`wait condition exceeded ${maxDuration}ms timeout (interval: ${interval}ms).`))
    //           })
    //         ])
    //           .then(() => $element.value.then(resolve))
    //           .catch(reject);
    //       }
    //
    //       reject(err);
    //     }
    //   );
    // });
    //
    // return new Element({matcher: this.matcher, value: nextValue});
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

  waitToBeVisible(options = {}) {
    const maxDuration = options.maxDuration || 5000;
    const interval = options.interval || 200;
    const conditionFn = ($e) => expect($e.isVisible()).toEqual(true);
    const timeoutError = `Element not visible after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutError);
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

        return commands.element.attributes.type(elementId);
      })
      .then(() => true)
      .catch((err) => {
        if (isInstanceOf(err, ElementNotFoundError)) {
          return false;
        }

        throw new ElementActionError("Failed to retrieve existence status of element.");
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