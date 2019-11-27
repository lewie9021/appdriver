const fetch = require("node-fetch").default;
const { configStore } = require("../../stores/configStore");
const { AppiumError } = require("../errors");

const qs = (params) => {
  if (!params) {
    return "";
  }

  const pairs = Object.keys(params)
    .reduce((result, key) => {
      const value = params[key];

      if (value === null || typeof value === "undefined") {
        return result;
      }

      return result.concat(`${key}=${encodeURIComponent(value)}`);
    }, []);

  if (!pairs.length) {
    return "";
  }

  return "?" + pairs.join("&");
};

const getFetchOpts = ({ method, payload }) => {
  let result = {};

  if (method) {
    result.method = method;
  }

  if (payload) {
    result.body = JSON.stringify(payload);

    if (!result.headers) {
      result.headers = {};
    }

    result.headers["Content-Type"] = "application/json";
  }

  return result;
};

const request = ({ method, path, query, payload, transform }) => {
  const baseUrl = configStore.getBaseUrl();
  const url = `${baseUrl}${path}${qs(query)}`;
  const opts = getFetchOpts({ method, path, query, payload });

  return fetch(url, opts)
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        throw new AppiumError(data.value.message, data.status);
      }

      return transform
        ? transform(data)
        : data.value;
    });
};

module.exports = {
  request
};