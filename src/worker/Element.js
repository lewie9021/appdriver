const fs = require("fs");
const { configStore } = require("../stores/configStore");
const { sessionStore } = require("./stores/sessionStore");
const { appiumService } = require("./services/appiumService");
const { Expect } = require("./Expect");
const { ElementNotFoundError, ElementActionError, ElementWaitError, AppiumError } = require("./errors");
const { isUndefined, isInstanceOf, isNull, pollFor } = require("../utils");

const getCurrentValue = (elementValue) => {
  return elementValue
    .catch((err) => {
      if (isInstanceOf(err, ElementNotFoundError) && err.matcher) {
        return appiumService.findElement({ matcher: err.matcher })
          .then((ref) => ({ ref, matcher: err.matcher }))
          .catch(() => {
            throw new ElementNotFoundError("Failed to find element.", err.matcher);
          });
      }

      throw err;
    })
    .then((value) => {
      if (isNull(value.ref) && value.matcher) {
        return appiumService.findElement({ matcher: value.matcher })
          .then((ref) => ({ ref, matcher: value.matcher }))
          .catch(() => {
            throw new ElementNotFoundError("Failed to find element.", value.matcher);
          });
      }

      return value;
    });
};

const handleActionError = (message) => (err) => {
  if (isInstanceOf(err, AppiumError)) {
    throw new ElementActionError(message);
  }

  throw err;
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

  _executeWait(conditionFn, maxDuration, interval, timeoutMessage) {
    const currentValue = getCurrentValue(this.value);

    const nextValue = new Promise((resolve, reject) => {
      currentValue.then(
        (value) => {
          pollFor(() => {
            const $element = new Element({ value: Promise.resolve(value) });

            return conditionFn($element);
          }, { maxDuration, interval })
            .then(() => resolve(value))
            .catch((errors) => {
              reject(new ElementWaitError(timeoutMessage, value.matcher, errors));
            });
        },
        (err) => {
          if (isInstanceOf(err, ElementNotFoundError) && err.matcher) {
            return pollFor(() => {
              const $element = new Element({ value: Promise.resolve({ ref: null, matcher: err.matcher }) });

              return conditionFn($element);
            }, { maxDuration, interval })
              .then(() => resolve({ ref: null, matcher: err.matcher }))
              .catch((errors) => {
                reject(new ElementWaitError(timeoutMessage, err.matcher, errors));
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
      currentValue
        .then((value) => {
          return appiumService.findElement({ matcher, element: value.ref })
            .then((ref) => resolve({ matcher: null, ref }));
        })
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            return reject(new ElementActionError("Failed to find element from element."));
          }

          reject(err);
        });
    });

    return new Element({ value: nextValue });
  }

  findElements(matcher) {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => {
        return appiumService.findElements({ element: value.ref, matcher })
          .then((refs) => {
            return refs.map((ref) => {
              return new Element({ value: Promise.resolve({ ref, matcher: null }) });
            });
          });
      })
      .catch((err) => {
        if (isInstanceOf(err, AppiumError)) {
          throw new ElementActionError("Failed to find elements from element.");
        }

        throw err;
      });
  }

  tap({ x, y } = {}) {
    return this._executeAction((value, done) => {
      return appiumService.tapElement({ element: value.ref, x, y })
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            return done(new ElementActionError("Failed to tap element."));
          }

          done(err);
        });
    });
  }

  longPress({ x, y, duration } = {}) {
    return this._executeAction((value, done) => {
      return appiumService.longPressElement({ element: value.ref, x, y, duration })
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            return done(new ElementActionError("Failed to long press element."));
          }

          done(err);
        });
    });
  }

  typeText(text) {
    return this._executeAction((value, done) => {
      return appiumService.sendElementKeys({ element: value.ref, keys: text.split("") })
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            if (err.status === 13 && sessionStore.getCapabilities("platformName") === "iOS") {
              return done(new ElementActionError("Failed to type text on element. Make sure hardware keyboard is disconnected from iOS simulator."));
            }

            return done(new ElementActionError("Failed to type text on element."));
          }

          return done(err);
        });
    });
  }

  clearText() {
    return this._executeAction((value, done) => {
      return appiumService.clearElementText({ element: value.ref })
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            return done(new ElementActionError("Failed to clear text on element."))
          }

          return done(err);
        });
    });
  }

  tapReturnKey() {
    return this._executeAction((value, done) => {
      return appiumService.tapElementReturnKey({ element: value.ref })
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            return done(new ElementActionError("Failed to tap return key on element."))
          }

          return done(err);
        });
    });
  }

  tapBackspaceKey() {
    return this._executeAction((value, done) => {
      return appiumService.tapElementBackspaceKey({ element: value.ref })
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            return done(new ElementActionError("Failed to tap backspace key on element."))
          }

          return done(err);
        });
    });
  }

  getSize() {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => appiumService.getElementSize({ element: value.ref }))
      .catch(handleActionError("Failed to get element size."));
  }

  getAttribute(name) {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => appiumService.getElementAttribute({ element: value.ref, attribute: name }))
      .catch(handleActionError("Failed to get element attribute."));
  }

  getLocation({ relative = false } = {}) {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => appiumService.getElementLocation({ element: value.ref, relative }))
      .catch(handleActionError("Failed to get element location."));
  }

  waitFor(conditionFn, options = {}) {
    const maxDuration = options.maxDuration || configStore.getWaitForTimeout();
    const interval = options.interval || configStore.getWaitForInterval();
    const timeoutMessage = `Wait condition exceeded ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutMessage);
  }

  waitToBeVisible(options = {}) {
    const maxDuration = options.maxDuration || configStore.getWaitForTimeout();
    const interval = options.interval || configStore.getWaitForInterval();
    const conditionFn = ($e) => new Expect($e).toBeVisible();
    const timeoutMessage = `Element not visible after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutMessage);
  }

  waitToBeInvisible(options = {}) {
    const maxDuration = options.maxDuration || configStore.getWaitForTimeout();
    const interval = options.interval || configStore.getWaitForInterval();
    const conditionFn = ($e) => new Expect($e).not.toBeVisible();
    const timeoutMessage = `Element still visible after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutMessage);
  }

  waitToExist(options = {}) {
    const maxDuration = options.maxDuration || configStore.getWaitForTimeout();
    const interval = options.interval || configStore.getWaitForInterval();
    const conditionFn = ($e) => new Expect($e).toExist();
    const timeoutMessage = `Element not found after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutMessage);
  }

  waitToNotExist(options = {}) {
    const maxDuration = options.maxDuration || configStore.getWaitForTimeout();
    const interval = options.interval || configStore.getWaitForInterval();
    const conditionFn = ($e) => new Expect($e).not.toExist();
    const timeoutMessage = `Element still found after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutMessage);
  }

  getText(options) {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => appiumService.getElementText({ element: value.ref, options }))
      .catch(handleActionError("Failed to get element text."));
  }

  getValue(options) {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => appiumService.getElementValue({ element: value.ref, options }))
      .catch(handleActionError("Failed to get element value."));
  }

  exists() {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => appiumService.getElementExists({ matcher: value.matcher }))
      .catch(handleActionError("Failed to retrieve existence status of element."))
      .catch((err) => {
        if (isInstanceOf(err, ElementNotFoundError)) {
          return appiumService.getElementExists({ matcher: err.matcher })
            .catch(handleActionError("Failed to retrieve existence status of element."));
        }

        throw err;
      });
  }

  isVisible() {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => appiumService.getElementVisibleAttribute({ element: value.ref }))
      .catch(handleActionError("Failed to retrieve visibility status of element."))
      .catch((err) => {
        if (isInstanceOf(err, ElementNotFoundError)) {
          return false;
        }

        throw err;
      });
  }

  isDisabled() {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => appiumService.getElementEnabledAttribute({ element: value.ref }))
      .then((enabled) => !enabled)
      .catch(handleActionError("Failed to retrieve disabled status of element."));
  }

  swipe({ x = 0, y = 0, distance, direction, duration = 50 }) {
    return this._executeAction((value, done) => {
      return appiumService.swipeElement({ element: value.ref, x, y, distance, direction, duration })
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            return done(new ElementActionError("Failed to swipe on element."));
          }

          done(err);
        });
    });
  }

  swipeUp({ x = 0, y, distance, percentage, duration = 50 }) {
    return this._executeAction((value, done) => {
      const resolveSwipeDistance = () => {
        if (!percentage) {
          return Promise.resolve(distance);
        }

        return appiumService.getElementSize({ element: value.ref })
          .then((size) => size.height * percentage);
      };

      return resolveSwipeDistance()
        .then((swipeDistance) => {
          return appiumService.swipeElement({
            element: value.ref,
            x,
            y: isUndefined(y) ? swipeDistance : y,
            distance: swipeDistance,
            direction: 0,
            duration
          });
        })
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            return done(new ElementActionError("Failed to swipe up on element."));
          }

          done(err);
        });
    });
  }

  swipeDown({ x = 0, y = 0, distance, percentage, duration = 50 }) {
    return this._executeAction((value, done) => {
      const resolveSwipeDistance = () => {
        if (!percentage) {
          return Promise.resolve(distance);
        }

        return appiumService.getElementSize({ element: value.ref })
          .then((size) => size.height * percentage);
      };

      return resolveSwipeDistance()
        .then((distance) => appiumService.swipeElement({ element: value.ref, x, y, distance, direction: 180, duration }))
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            return done(new ElementActionError("Failed to swipe down on element."));
          }

          done(err);
        });
    });
  }

  swipeLeft({ x, y = 0, distance, percentage, duration = 50 }) {
    return this._executeAction((value, done) => {
      const resolveSwipeDistance = () => {
        if (!percentage) {
          return Promise.resolve(distance);
        }

        return appiumService.getElementSize({ element: value.ref })
          .then((size) => size.width * percentage);
      };

      return resolveSwipeDistance()
        .then((swipeDistance) => {
          return appiumService.swipeElement({
            element: value.ref,
            x: isUndefined(x) ? swipeDistance : x,
            y,
            distance: swipeDistance,
            direction: 270,
            duration
          });
        })
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            return done(new ElementActionError("Failed to swipe left on element."));
          }

          done(err);
        });
    });
  }

  swipeRight({ x = 0, y = 0, distance, percentage, duration = 50 }) {
    return this._executeAction((value, done) => {
      const resolveSwipeDistance = () => {
        if (!percentage) {
          return Promise.resolve(distance);
        }

        return appiumService.getElementSize({ element: value.ref })
          .then((size) => size.width * percentage);
      };

      return resolveSwipeDistance()
        .then((distance) => appiumService.swipeElement({ element: value.ref, x, y, distance, direction: 90, duration }))
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            return done(new ElementActionError("Failed to swipe right on element."));
          }

          done(err);
        });
    });
  }

  takeScreenshot({ filePath } = {}) {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => appiumService.takeElementScreenshot({ element: value.ref }))
      .then((value) => {
        const buffer = Buffer.from(value, "base64");

        if (!filePath) {
          return Promise.resolve(buffer);
        }

        return new Promise((resolve, reject) => {
          fs.writeFile(filePath, Buffer.from(value, "base64"), (err) => {
            if (err) {
              return reject(new ElementActionError("Failed to store element screenshot on disk."));
            }

            resolve(buffer);
          });
        });
      })
      .catch(handleActionError("Failed to take element screenshot."));
  }
}

module.exports = {
  Element
};