const fs = require("fs");
const { configStore } = require("../stores/configStore");
const { appiumService } = require("./services/appiumService");
const { Expect } = require("./Expect");
const { ElementNotFoundError, ElementActionError, ElementWaitError, AppiumError } = require("./errors");
const { isPlatform, isUndefined, isInstanceOf, isNull, pollFor } = require("../utils");

const getCurrentValue = (elementValue) => {
  return elementValue
    .catch((err) => {
      if (isInstanceOf(err, ElementNotFoundError) && err.matcher) {
        return appiumService.findElement({ matcher: err.matcher })
          .then((ref) => ({ ref, matcher: err.matcher }))
          .catch(() => { throw new ElementNotFoundError(err.matcher); });
      }

      throw err;
    })
    .then((value) => {
      if (isNull(value.ref) && value.matcher) {
        return appiumService.findElement({ matcher: value.matcher })
          .then((ref) => ({ ref, matcher: value.matcher }))
          .catch(() => { throw new ElementNotFoundError(value.matcher); });
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
  constructor({ value, options, thenable = true }) {
    this.value = value;
    this.options = options;

    if (thenable) {
      this.then = function then(onResolved, onRejected) {
        return this.value.then((nextValue) => {
          onResolved(new Element({
            value: Promise.resolve(nextValue),
            options,
            thenable: false
          }));
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

  getRef() {
    return getCurrentValue(this.value)
      .then((value) => value.ref);
  }

  findElement(matcher, options) {
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

    return new Element({ value: nextValue, options });
  }

  findElements(matcher, options) {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => {
        return appiumService.findElements({ element: value.ref, matcher })
          .then((refs) => {
            return refs.map((ref) => {
              return new Element({
                value: Promise.resolve({ ref, matcher: null }),
                options
              });
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

  tap({ x = 0, y = 0 } = {}) {
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

  doubleTap({ x = 0, y = 0 } = {}) {
    return this._executeAction((value, done) => {
      return appiumService.doubleTapElement({ element: value.ref, x, y })
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            return done(new ElementActionError("Failed to double tap element."));
          }

          done(err);
        });
    });
  }

  longPress({ x = 0, y = 0, duration } = {}) {
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

  setValue(value) {
    return this._executeAction(({ ref }, done) => {
      return appiumService.setElementValue({ element: ref, value, options: this.options })
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            if (err.status === 13 && isPlatform("iOS")) {
              return done(new ElementActionError([
                "Failed to set value on element.",
                "Ensure hardware keyboard is disconnected from iOS simulator."
              ].join(" ")));
            }

            return done(new ElementActionError("Failed to set value on element."));
          }

          return done(err);
        });
    });
  }

  typeText(text) {
    return this._executeAction((value, done) => {
      return appiumService.typeElementText({ element: value.ref, text })
        .then(() => done(null))
        .catch((err) => {
          if (isInstanceOf(err, AppiumError)) {
            if (err.status === 13 && isPlatform("iOS")) {
              return done(new ElementActionError([
                "Failed to type text on element.",
                "Ensure hardware keyboard is disconnected from iOS simulator."
              ].join(" ")));
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
            if (err.status === 12 && isPlatform("iOS")) {
              return done(new ElementActionError([
                "Failed to clear text on element.",
                "Ensure hardware keyboard is disconnected from iOS simulator."
              ].join(" ")));
            }

            return done(new ElementActionError("Failed to clear text on element."));
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
            return done(new ElementActionError("Failed to tap return key on element."));
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
            return done(new ElementActionError("Failed to tap backspace key on element."));
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

  waitToBeFocused(options = {}) {
    const maxDuration = options.maxDuration || configStore.getWaitForTimeout();
    const interval = options.interval || configStore.getWaitForInterval();
    const conditionFn = ($e) => new Expect($e).toBeFocused();
    const timeoutMessage = `Element not focused after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return this._executeWait(conditionFn, maxDuration, interval, timeoutMessage);
  }

  getText(options) {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => appiumService.getElementText({ element: value.ref, options }))
      .catch(handleActionError("Failed to get element text."));
  }

  getValue() {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => appiumService.getElementValue({ element: value.ref, options: this.options }))
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

  isFocused() {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => appiumService.getElementFocusedAttribute({ element: value.ref }))
      .catch(handleActionError("Failed to retrieve focused status of element."));
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

  isSelected() {
    const currentValue = getCurrentValue(this.value);

    return currentValue
      .then((value) => appiumService.getElementSelectedAttribute({ element: value.ref }))
      .catch(handleActionError("Failed to retrieve selected status of element."));
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
        .then((swipeDistance) => {
          return appiumService.swipeElement({
            element: value.ref,
            x,
            y,
            distance: swipeDistance,
            direction: 180,
            duration
          });
        })
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
        .then((swipeDistance) => {
          return appiumService.swipeElement({
            element: value.ref,
            x,
            y,
            distance: swipeDistance,
            direction: 90,
            duration
          });
        })
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
