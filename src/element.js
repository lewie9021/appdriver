const commands = require("./commands");
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

        commands.element.actions.click(value.value.ELEMENT)
          .then(() => resolve(value));
      }, reject);
    });

    return this;
  }

  getElementId() {
    return this.value.then((value) => {
      return value.value.ELEMENT;
    })
  }

  getSize() {
    return this.value.then((value) => {
      if (value.status === 7) {
        throw new Error("Can't get size of element that doesn't exist");
      }

      return commands.element.attributes.size(value.value.ELEMENT)
    });
  }

  waitToBeVisible() {
    const currentValue = this.value;

    this.value = new Promise((resolve, reject) => {
      currentValue.then((value) => {
        return pollDisplayed(value.value.ELEMENT)
          .then(() => resolve(value));
      }, reject);
    });

    return this;
  }

  waitToExist(matcher) {
    const currentValue = this.value;

    this.value = new Promise((resolve, reject) => {
      currentValue.then((value) => {
        if (value.status === 0) {
          return resolve(value);
        }

        return pollExist(matcher)
          .then((x) => resolve(x));
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