jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const requestHelpers = require("../../src/worker/services/request");
const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform } = require("../helpers");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("makes a POST request to the correct Appium endpoint", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const text = "Hello World!";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await appiumService.typeElementText({ element: ref, text: "Hello World!" });

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/value`,
      payload: {
        value: text.split("")
      }
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await appiumService.typeElementText({ sessionId, element: ref, text: "Hello World!" });

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/session/${sessionId}/element/${ref.ELEMENT}/value`
      })
    );
  });
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));

  // W3C actions are used to mimic similar behaviour to iOS in that each key is typed individually.
  it("makes a POST request to the correct Appium endpoint", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const text = "Hello World!";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await appiumService.typeElementText({ element: ref, text: "Hello World!" });

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/actions`,
      payload: {
        actions: [{
          id: "keyboard",
          type: "key",
          actions: [
            { type: "keyDown", value: "H" },
            { type: "keyUp", value: "H" },
            { type: "keyDown", value: "e" },
            { type: "keyUp", value: "e" },
            { type: "keyDown", value: "l" },
            { type: "keyUp", value: "l" },
            { type: "keyDown", value: "l" },
            { type: "keyUp", value: "l" },
            { type: "keyDown", value: "o" },
            { type: "keyUp", value: "o" },
            { type: "keyDown", value: " " },
            { type: "keyUp", value: " " },
            { type: "keyDown", value: "W" },
            { type: "keyUp", value: "W" },
            { type: "keyDown", value: "o" },
            { type: "keyUp", value: "o" },
            { type: "keyDown", value: "r" },
            { type: "keyUp", value: "r" },
            { type: "keyDown", value: "l" },
            { type: "keyUp", value: "l" },
            { type: "keyDown", value: "d" },
            { type: "keyUp", value: "d" },
            { type: "keyDown", value: "!" },
            { type: "keyUp", value: "!" },
          ]
        }]
      }
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await appiumService.typeElementText({ sessionId, element: ref, text: "Hello World!" });

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/session/${sessionId}/actions`
      })
    );
  });
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));

  it("makes a POST request to the correct Appium endpoint", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const text = "Hello World!";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await appiumService.typeElementText({ element: ref, text: "Hello World!" });

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/value`,
      payload: {
        value: text.split("")
      }
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await appiumService.typeElementText({ sessionId, element: ref, text: "Hello World!" });

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/session/${sessionId}/element/${ref.ELEMENT}/value`
      })
    );
  });
});
