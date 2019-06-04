const { Response } = jest.requireActual("node-fetch");
const fetch = require("node-fetch");

let requests = [];

const matchRequest = (url, opts) => {
  const method = (opts && opts.method) || "GET";

  let matches = requests.filter((x) => x.url === url && x.method === method);

  if (!matches.length) {
    return null;
  }

  return matches.find((x) => !x.calls.length) || matches[matches.length - 1];
};

const fetchMock = async (url, opts) => {
  let request = matchRequest(url, opts);

  if (!request) {
    const method = (opts && opts.method) || "GET";

    throw new Error(`No mock implementation was found for ${method} '${url}'.`);
  }

  request.calls.push({url, options: opts});

  return new Response(JSON.stringify(request.response), {status: request.status});
};

const get = ({url, status, response, name}) => {
  if (!requests.length) {
    fetch.mockImplementation(fetchMock);
  }

  const requestId = requests.length;

  requests.push({
    method: "GET",
    url,
    status,
    response,
    requestId,
    calls: []
  });

  return requestId
};

const post = ({url, status, payload, response, name}) => {
  if (!requests.length) {
    fetch.mockImplementation(fetchMock);
  }

  const requestId = requests.length;

  requests.push({
    method: "POST",
    url,
    payload,
    status,
    response,
    requestId,
    calls: []
  });

  return requestId;
};

const reset = () => {
  fetch.mockRestore();
  requests = [];
};

const lookupCalls = (requestId) => {
  const request = requests.find((request) => request.requestId === requestId);

  return request ? request.calls : [];
};

module.exports = {
  get,
  reset,
  post,
  lookupCalls
};