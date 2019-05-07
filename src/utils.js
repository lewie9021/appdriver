const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const isNumber = (x) => {
  return typeof x === "number";
};

const isUndefined = (x) => {
  return typeof x === "undefined";
};

module.exports = {
  delay,
  isNumber,
  isUndefined
};