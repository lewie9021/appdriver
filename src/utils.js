const { getSession } = require("./session");

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const pollFor = (promiseFn, {maxDuration, interval}) => {
  return new Promise((resolve, reject) => {
    let timedOut = false;
    let errors = [];

    const timeout = setTimeout(() => {
      timedOut = true;
    }, maxDuration);

    const next = (err) => {
      if (err) {
        errors.push(err);
      }

      if (timedOut) {
        return reject(errors);
      }

      if (err) {
        return delay(interval)
          .then(() => {
            promiseFn()
              .then(() => next())
              .catch((err) => next(err || new Error("'conditionFn' threw with an undefined error.")));
          })
      }

      clearTimeout(timeout);
      resolve();
    };

    promiseFn()
      .then(() => next())
      .catch((err) => next(err || new Error("'conditionFn' threw with an undefined error.")));
  });
};

const log = (x) => {
  console.log(JSON.stringify(x, null, 2));

  return x;
};

const toBoolean = (x) => {
  if (isString(x)) {
    switch (x) {
      case "0":
      case "false":
        return false;
      default:
        return true;
    }
  }

  return Boolean(x);
};

const toNumber = (x) => {
  if (isString(x)) {
    return parseFloat(x);
  }

  return x;
};

const isBoolean = (x) => {
  return typeof x === "boolean";
};

const isString = (x) => {
  return typeof x === "string";
};

const isNumber = (x) => {
  return typeof x === "number";
};

const isPromise = (x) => {
  return x === Promise.resolve(x);
};

const isArray = (x) => {
  return Array.isArray(x);
};

const isNull = (x) => {
  return x === null;
};

const isUndefined = (x) => {
  return typeof x === "undefined";
};

const isInstanceOf = (x, instance) => {
  return x instanceof instance;
};

const getValueType = (value) => {
  if (isArray(value)) {
    return "array";
  }

  if (isPromise(value)) {
    return "promise";
  }

  if (isNull(value)) {
    return "null";
  }

  return typeof value;
};

const platform = {
  select: ({ios, android}) => {
    switch (getSession("platformName")) {
      case "iOS":
        return ios();
      case "Android":
        return android();
      default:
        throw new Error("Platform not supported");
    }
  }
};

module.exports = {
  delay,
  pollFor,
  log,
  isBoolean,
  isString,
  isNumber,
  isPromise,
  isArray,
  isNull,
  isUndefined,
  isInstanceOf,
  getValueType,
  toBoolean,
  toNumber,
  platform
};