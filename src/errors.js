class ElementNotFoundError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, ElementNotFoundError);
    this.name = this.constructor.name;
  }
}

class ElementsNotFoundError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, ElementsNotFoundError);
    this.name = this.constructor.name;
  }
}

class ElementActionError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, ElementActionError);
    this.name = this.constructor.name;
  }
}

class ElementWaitError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, ElementWaitError);
    this.name = this.constructor.name;
  }
}

class NotImplementedError extends Error {
  constructor() {
    super("Functionality not implemented.");

    Error.captureStackTrace(this, NotImplementedError);
    this.name = this.constructor.name;
  }
}

class AppiumError extends Error {
  constructor(message, status) {
    super(message);

    Error.captureStackTrace(this, AppiumError);
    this.name = this.constructor.name;
    this.status = status;
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