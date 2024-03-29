const { last } = require("../utils");

class ElementNotFoundError extends Error {
  constructor(matcher) {
    super(`Failed to find element by ${matcher.type} matching "${matcher.value}".`);

    Error.captureStackTrace(this, ElementNotFoundError);
    this.name = this.constructor.name;
    this.matcher = matcher;
  }
}

class ElementsNotFoundError extends Error {
  constructor(matcher) {
    super(`Failed to find elements by ${matcher.type} matching "${matcher.value}".`);

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
  constructor(message, matcher, errors) {
    super(message);

    Error.captureStackTrace(this, ElementWaitError);
    this.name = this.constructor.name;
    this.matcher = matcher;
    this.conditionError = last(errors);
  }
}

class WaitError extends Error {
  constructor(message, errors) {
    super(message);

    Error.captureStackTrace(this, WaitError);
    this.name = this.constructor.name;

    if (errors.length) {
      this.conditionError = last(errors);
    }
  }
}

class NotImplementedError extends Error {
  constructor(message) {
    super(message || "Functionality not implemented.");

    Error.captureStackTrace(this, NotImplementedError);
    this.name = this.constructor.name;
  }
}

class NotSupportedError extends Error {
  constructor(message) {
    super(message || "Functionality not supported.");

    Error.captureStackTrace(this, NotSupportedError);
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
  WaitError,
  ActionError,
  NotImplementedError,
  NotSupportedError,
  AppiumError
};