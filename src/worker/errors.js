class ElementNotFoundError extends Error {
  constructor(message, matcher) {
    super(message);

    Error.captureStackTrace(this, ElementNotFoundError);
    this.name = this.constructor.name;
    this.matcher = matcher;
  }
}

class ElementsNotFoundError extends Error {
  constructor(message, matcher) {
    super(message);

    Error.captureStackTrace(this, ElementsNotFoundError);
    this.name = this.constructor.name;
    this.matcher = matcher;
  }
}

class ElementActionError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, ElementActionError);
    this.name = this.constructor.name;
  }
}

class ActionError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, ActionError);
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
  ActionError,
  NotImplementedError,
  AppiumError
};