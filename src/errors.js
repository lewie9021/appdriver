class ElementNotFoundError extends Error {
  constructor(message) {
    super(message);
  }
}

class ElementsNotFoundError extends Error {
  constructor(message) {
    super(message);
  }
}

class ElementActionError extends Error {
  constructor(message) {
    super(message);
  }
}

class NotImplementedError extends Error {
  constructor(message) {
    super("Functionality not yet implemented.");
  }
}

module.exports = {
  ElementNotFoundError,
  ElementsNotFoundError,
  ElementActionError,
  NotImplementedError
};