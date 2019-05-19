jest.mock("node-fetch");

const fixtures = require("../fixtures/fixtures");
const mockRequests = require("./mockRequests");

const BASE_URL = "http://localhost:4723/wd/hub";

const mockElementClick = ({status = 0} = {}) => {
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/elementId/click`,
    response: fixtures.createElementClickFixture({status})
  });
};

const mockFindElement = ({status, elementId} = {}) => {
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element`,
    response: fixtures.createElementFixture({status, elementId})
  });
};

const resetMocks = () => {
  mockRequests.reset();
};

module.exports = {
  mockFindElement,
  mockElementClick,
  resetMocks
};