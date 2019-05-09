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

module.exports = {
  ElementNotFoundError,
  ElementsNotFoundError,
  ElementActionError
};