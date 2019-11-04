const fetch = require("node-fetch").default;
const { AppiumError } = require("../errors");

const BASE_URL = "http://localhost:4723/wd/hub";

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

const get = ({ path, query, transform }) => {
  const queryString = qs(query);

  return fetch(`${BASE_URL}${path}${queryString}`)
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

const post = ({ path, query, payload, transform }) => {
  const queryString = qs(query);
  const opts = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  };

  return fetch(`${BASE_URL}${path}${queryString}`, opts)
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

const del = ({ path, transform }) => {
  const opts = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  };

  return fetch(`${BASE_URL}${path}`, opts)
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
  get,
  post,
  del
};