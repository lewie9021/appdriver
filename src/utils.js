const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const isNumber = (x) => {
  return typeof x === "number";
};

module.exports = {
  delay,
  isNumber
};