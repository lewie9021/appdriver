jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const requestHelpers = require("../../src/worker/services/request");
const { NotSupportedError } = require("../../src/worker/errors");
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

  it("supports text inputs", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const value = "Hello World!";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeTextField")
      .mockResolvedValue();

    await appiumService.setElementValue({ element: ref, value });

    expect(requestHelpers.request).toHaveBeenCalledTimes(3);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/value`,
      payload: {
        value: value.split("")
      }
    });
  });

  it("clears the existing value in text inputs", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const value = "Hello World!";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeTextField")
      .mockResolvedValue();

    await appiumService.setElementValue({ element: ref, value });

    expect(requestHelpers.request).toHaveBeenCalledTimes(3);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/clear`
    });
  });

  it("supports sliders", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const value = 5;
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeSlider")
      .mockResolvedValue();

    await appiumService.setElementValue({ element: ref, value, options: { sliderRange: [ 0, 10 ]} });

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/value`,
      payload: {
        value: "0.5".split("")
      }
    });
  });

  it("throws for sliders if no 'sliderRange' option is given", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeSlider")
      .mockResolvedValue();
    expect.assertions(4);

    try {
      await appiumService.setElementValue({ element: ref, value: 5 });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        "message",
        "You must provide a 'sliderRange' option to set slider values."
      );
    }

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/session/${sessionId}/element/${ref.ELEMENT}/name`
      })
    );
  });

  it("throws a NotSupportedError for switches", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeSwitch")
      .mockResolvedValue();
    expect.assertions(4);

    try {
      await appiumService.setElementValue({ element: ref, value: true });
    } catch (err) {
      expect(err).toBeInstanceOf(NotSupportedError);
      expect(err).toHaveProperty("message", "Functionality not supported.");
    }

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/session/${sessionId}/element/${ref.ELEMENT}/name`
      })
    );
  });

  it("attempts to set the value of unknown element types", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const value = "Test";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeOther")
      .mockResolvedValue();

    await appiumService.setElementValue({ element: ref, value });

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/value`,
      payload: {
        value: value.split("")
      }
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("XCUIElementTypeTextField")
      .mockResolvedValue();

    await appiumService.setElementValue({ sessionId, element: ref, value: "Hello World!" });

    expect(requestHelpers.request).toHaveBeenCalledTimes(3);
    expect(requestHelpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/session/${sessionId}/element/${ref.ELEMENT}/name`
      })
    );
    expect(requestHelpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/session/${sessionId}/element/${ref.ELEMENT}/clear`
      })
    );
    expect(requestHelpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/session/${sessionId}/element/${ref.ELEMENT}/value`
      })
    );
  });
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));

  it("supports text inputs", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const value = "Hello World!";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("android.widget.EditText")
      .mockResolvedValue();

    await appiumService.setElementValue({ element: ref, value });

    expect(requestHelpers.request).toHaveBeenCalledTimes(3);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/value`,
      payload: {
        value: value.split("")
      }
    });
  });

  it("clears the existing value in text inputs", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const value = "Hello World!";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("android.widget.EditText")
      .mockResolvedValue();

    await appiumService.setElementValue({ element: ref, value });

    expect(requestHelpers.request).toHaveBeenCalledTimes(3);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/clear`
    });
  });

  it("supports sliders", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const value = 5;
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("android.widget.SeekBar")
      .mockResolvedValue();

    await appiumService.setElementValue({ element: ref, value, options: { sliderRange: [ 0, 10 ]} });

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/value`,
      payload: {
        value: value.toString().split("")
      }
    });
  });

  it("throws for sliders if no 'sliderRange' option is given", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("android.widget.SeekBar")
      .mockResolvedValue();
    expect.assertions(4);

    try {
      await appiumService.setElementValue({ element: ref, value: 5 });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        "message",
        "You must provide a 'sliderRange' option to set slider values."
      );
    }

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/className`
      })
    );
  });

  it("throws a NotSupportedError for switches", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("android.widget.Switch")
      .mockResolvedValue();
    expect.assertions(4);

    try {
      await appiumService.setElementValue({ element: ref, value: true });
    } catch (err) {
      expect(err).toBeInstanceOf(NotSupportedError);
      expect(err).toHaveProperty("message", "Functionality not supported.");
    }

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/className`
      })
    );
  });

  it("attempts to set the value of unknown element types", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const value = "Test";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("android.view.ViewGroup")
      .mockResolvedValue();

    await appiumService.setElementValue({ element: ref, value });

    expect(requestHelpers.request).toHaveBeenCalledTimes(2);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/value`,
      payload: {
        value: value.split("")
      }
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce("android.widget.EditText")
      .mockResolvedValue();

    await appiumService.setElementValue({ sessionId, element: ref, value: "Hello World!" });

    expect(requestHelpers.request).toHaveBeenCalledTimes(3);
    expect(requestHelpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/className`
      })
    );
    expect(requestHelpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/session/${sessionId}/element/${ref.ELEMENT}/clear`
      })
    );
    expect(requestHelpers.request).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/session/${sessionId}/element/${ref.ELEMENT}/value`
      })
    );
  });
});
