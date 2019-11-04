class ElementNotFoundError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, ElementNotFoundError);
  }
}

class ElementsNotFoundError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, ElementsNotFoundError);
  }
}

class ElementActionError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, ElementActionError);
  }
}

class ElementWaitError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, ElementWaitError);
  }
}

class NotImplementedError extends Error {
  constructor() {
    super("Functionality not implemented.");

    Error.captureStackTrace(this, NotImplementedError);
  }
}

class AppiumError extends Error {
  constructor(status) {
    super(status);

    Error.captureStackTrace(this, AppiumError);
  }
}

module.exports = {
  ElementNotFoundError,
  ElementsNotFoundError,
  ElementActionError,
  ElementWaitError,
  NotImplementedError,
  AppiumError
};