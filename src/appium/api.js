const fetch = require("node-fetch");

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

const get = (path, params) => {
  const query = qs(params);

  return fetch(`${BASE_URL}${path}${query}`)
    .then((res) => res.json());
};

const post = (path, params, payload) => {
  const query = qs(params);
  const opts = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  };

  return fetch(`${BASE_URL}${path}${query}`, opts)
    .then((res) => res.json());
};

const del = (path) => {
  const opts = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  };

  return fetch(`${BASE_URL}${path}`, opts)
    .then((res) => res.json());
};

module.exports = {
  get,
  post,
  del
};