const { sessionStore } = require("./worker/stores/sessionStore");

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const pollFor = (promiseFn, { maxDuration, interval }) => {
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

const isInstanceOf = (x, instance) => {
  return x instanceof instance;
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

const isRegex = (x) => isInstanceOf(x, RegExp);

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

const getRelativePoint = ({ direction, distance }) => {
  const radians = direction * (Math.PI / 180);
  const x = Math.round(Math.sin(radians) * distance);
  const y = Math.round(Math.cos(radians) * distance);

  return {
    x: x,
    y: y === -0
      ? 0
      : y * -1
  };
};

const transformArgs = (args) => {
  return Object.keys(args)
    .reduce((result, key) => {
      const param = `--${key}`;
      const value = args[key];

      if (isNull(value) || isUndefined(value)) {
        return result;
      }

      if (isBoolean(value) && value === true) {
        return result.concat(param);
      }

      return result.concat(param, value.toString());
    }, []);
};

const last = (arr) => arr[arr.length - 1];

const platform = {
  select: ({ ios, android, web }) => {
    if (sessionStore.getWebContext()) {
      return web();
    }

    switch (sessionStore.getCapabilities("platformName")) {
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
  isRegex,
  isPromise,
  isArray,
  isNull,
  isUndefined,
  isInstanceOf,
  toBoolean,
  toNumber,
  getValueType,
  getRelativePoint,
  transformArgs,
  last,
  platform
};