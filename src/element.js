const commands = require("./commands");
const { delay } = require("./utils");

const poll = (func, maxRetries = 3) => {
  return func()
    .catch((err) => {
      if (maxRetries <= 1) {
        throw err
      }

      return poll(func, maxRetries - 1);
    });
};

const pollDisplayed = (sessionId, elementId) => {
  return poll(() => {
    return commands.element.attributes.displayed(sessionId, elementId)
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
    console.log("polling...");
    return commands.element.attributes.exists(matcher)
      .then((x) => {
        if (!x.value) {
          throw new Error("Element not displayed");
        }

        return x;
      });
  });
};

class Element {
  constructor(value) {
    this.value = value;
  }

  tap() {
    const currentValue = this.value;

    this.value = new Promise((resolve, reject) => {
      currentValue.then((value) => {
        if (value.status === 7) {
          throw new Error("Can't tap element that doesn't exist");
        }

        commands.element.actions.tap(value.sessionId, value.value.ELEMENT)
          .then(() => resolve(value));
      }, reject);
    });

    return this;
  }

  waitToBeVisible() {
    const currentValue = this.value;

    this.value = new Promise((resolve, reject) => {
      currentValue.then((value) => {
        return pollDisplayed(value.sessionId, value.value.ELEMENT)
          .then((x) => {
            console.log("x:", x);

            resolve(value);
          });
      }, reject);
    });

    return this;
  }

  waitToExist(matcher) {
    const currentValue = this.value;

    this.value = new Promise((resolve, reject) => {
      currentValue.then((value) => {
        if (value.status === 0) {
          console.log("element already exists....");
          return resolve(value);
        }

        return pollExist(matcher)
          .then((x) => {
            console.log("x:", x);

            resolve(value);
          });
      }, reject);
    });

    return this;
  }

  log(title) {
    const currentValue = this.value;

    this.value = new Promise((resolve, reject) => {
      currentValue.then((x) => {
        return delay(1000)
          .then(() => {
            console.log(title, x);

            resolve(x);
          });
      }, reject);
    });

    return this;
  }
}

const element = (matcher) => {
  let $element = new Element(matcher.resolve());

  $element.then = function(resolve, reject) {
    return this.value.then((value) => {
      const promise = Promise.resolve(value);

      resolve(new Element(promise));
    }, reject);
  };

  return $element;
};

module.exports = {
  element,
  Element
};