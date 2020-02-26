jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const requestHelpers = require("../../src/worker/services/request");
const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { NotSupportedError } = require("../../src/worker/errors");
const { setPlatform } = require("../helpers");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("returns a string for text inputs", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const value = "Hello World!";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeTextField")
      .mockResolvedValueOnce(value);

    await expect(appiumService.getElementValue({ element: ref }))
      .resolves.toEqual(value);

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/name`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/value`
    });
  });

  it("returns true for a switch (ON)", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeSwitch")
      .mockResolvedValueOnce("1");

    await expect(appiumService.getElementValue({ element: ref }))
      .resolves.toEqual(true);

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/name`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/value`
    });
  });

  it("returns false for a switch (OFF)", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeSwitch")
      .mockResolvedValueOnce("0");

    await expect(appiumService.getElementValue({ element: ref }))
      .resolves.toEqual(false);

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/name`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/value`
    });
  });

  it("returns a number for sliders", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const sliderRange = [0, 5];
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeSlider")
      .mockResolvedValueOnce("50%");

    await expect(appiumService.getElementValue({ element: ref, options: { sliderRange } }))
      .resolves.toEqual(2.5);

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/name`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/value`
    });
  });

  it("throws for a slider when 'sliderRange' isn't passed", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeSlider")
      .mockResolvedValueOnce("50%");
    expect.assertions(5);

    try {
      await appiumService.getElementValue({ element: ref });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty("message", "You must provide a 'sliderRange' option to retrieve slider values.");
    }

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/name`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/value`
    });
  });

  it("doesn't convert values of unknown elements", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const value = "Test";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeOther")
      .mockResolvedValueOnce(value);

    await expect(appiumService.getElementValue({ element: ref }))
      .resolves.toEqual(value);

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/name`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/value`
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const ref = createFindElementMock();
    const value = "Hello World!";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeOther")
      .mockResolvedValueOnce(value);

    await expect(appiumService.getElementValue({ sessionId, element: ref }))
      .resolves.toEqual(value);

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/name`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/value`
    });
  });
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));

  it("returns a string for text inputs", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const value = "Hello World!";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("android.widget.EditText")
      .mockResolvedValueOnce(value);

    await expect(appiumService.getElementValue({ element: ref }))
      .resolves.toEqual(value);

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/className`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/text`
    });
  });

  it("returns true for a switch (ON)", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("android.widget.Switch")
      .mockResolvedValueOnce("ON");

    await expect(appiumService.getElementValue({ element: ref }))
      .resolves.toEqual(true);

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/className`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/text`
    });
  });

  it("returns false for a switch (OFF)", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("android.widget.Switch")
      .mockResolvedValueOnce("OFF");

    await expect(appiumService.getElementValue({ element: ref }))
      .resolves.toEqual(false);

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/className`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/text`
    });
  });

  it("returns a number for sliders", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const sliderRange = [0, 5];
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("android.widget.SeekBar")
      .mockResolvedValueOnce("2.5");

    await expect(appiumService.getElementValue({ element: ref, options: { sliderRange } }))
      .resolves.toEqual(2.5);

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/className`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/text`
    });
  });

  it("throws for a slider when 'sliderRange' isn't passed", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeSlider")
      .mockResolvedValueOnce("50%");
    expect.assertions(5);

    try {
      await appiumService.getElementValue({ element: ref });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty("message", "You must provide a 'sliderRange' option to retrieve slider values.");
    }

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/className`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/text`
    });
  });

  it("doesn't convert values of unknown elements", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const value = "Test";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("android.view.ViewGroup")
      .mockResolvedValueOnce(value);

    await expect(appiumService.getElementValue({ element: ref }))
      .resolves.toEqual(value);

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/className`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/text`
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const ref = createFindElementMock();
    const value = "Hello World!";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("android.view.ViewGroup")
      .mockResolvedValueOnce(value);

    await expect(appiumService.getElementValue({ sessionId, element: ref }))
      .resolves.toEqual(value);

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/className`
    });
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/text`
    });
  });
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));

  it("throws a NotSupportedError", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();
    expect.assertions(3);

    try {
      await appiumService.getElementValue({ element: ref });
    } catch (err) {
      expect(err).toBeInstanceOf(NotSupportedError);
      expect(err).toHaveProperty("message", "Functionality not supported.");
    }

    expect(requestHelpers.request).not.toHaveBeenCalled();
  });
});