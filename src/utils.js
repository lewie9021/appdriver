const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const log = (x) => {
  console.log(JSON.stringify(x, null, 2));

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

module.exports = {
  delay,
  log,
  isBoolean,
  isString,
  isNumber,
  isPromise,
  isArray,
  isNull,
  isUndefined,
  getValueType
};