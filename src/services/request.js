const fetch = require("node-fetch").default;
const { configService } = require("./configService");
const { AppiumError } = require("../errors");

const BASE_URL = configService.getBaseUrl();

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

const request = ({ method, path, query, payload, transform }) => {
  const url = `${BASE_URL}${path}${qs(query)}`;
  const opts = {
    method: method,
    body: payload
      ? JSON.stringify(payload)
      : undefined,
    headers: {
      "Content-Type": "application/json"
    }
  };

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

module.exports = request;