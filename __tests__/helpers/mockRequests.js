const { Response } = jest.requireActual("node-fetch");
const fetch = require("node-fetch");

let requests = [];

const matchRequest = (url, opts) => {
  const method = (opts && opts.method) || "GET";

  let matches = requests.filter((x) => x.url === url && x.method === method);

  if (!matches.length) {
    return null;
  }

  return matches.find((x) => !x.called) || matches[matches.length - 1];
};

const fetchMock = async (url, opts) => {
  let request = matchRequest(url, opts);

  if (!request) {
    throw new Error(`No mock implementation was found for '${url}'.`);
  }

  request.called = true;

  return new Response(JSON.stringify(request.response), {status: request.status});
};

const get = ({url, status, response}) => {
  if (!requests.length) {
    fetch.mockImplementation(fetchMock);
  }

  requests.push({
    method: "GET",
    url,
    status,
    response
  });
};

const post = ({url, status, payload, response}) => {
  if (!requests.length) {
    fetch.mockImplementation(fetchMock);
  }

  requests.push({
    method: "POST",
    url,
    payload,
    status,
    response
  });
};

const reset = () => {
  fetch.mockReset();
  requests = [];
};

module.exports = {
  get,
  reset,
  post
};