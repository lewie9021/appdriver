const { isBoolean, isNull, isUndefined } = require("../utils");

function transformArgs(args) {
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
}

module.exports = {
  transformArgs
};