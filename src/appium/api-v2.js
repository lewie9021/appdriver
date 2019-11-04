const { fetch } = require("node-fetch");
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

const get = ({ path, query }) => {
  const queryString = qs(query);

  return fetch(`${BASE_URL}${path}${queryString}`)
    .then((res) => res.json())
    .then(({ status, value }) => {
      if (status) {
        throw new AppiumError(value.message, status);
      }

      return value;
    });
};

const post = ({ path, query, payload }) => {
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
    .then(({ status, value }) => {
      if (status) {
        throw new AppiumError(value.message, status);
      }

      return value;
    });
};

const del = ({ path }) => {
  const opts = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  };

  return fetch(`${BASE_URL}${path}`, opts)
    .then((res) => res.json())
    .then(({ status, value }) => {
      if (status) {
        throw new AppiumError(value.message, status);
      }

      return value;
    });
};

module.exports = {
  get,
  post,
  del
};