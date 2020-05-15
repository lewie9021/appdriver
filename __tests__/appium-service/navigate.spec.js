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

const runAndroidAndNativeTests = () => {
  it("makes a POST request to the correct Appium endpoint", async () => {
    const sessionId = "sessionId";
    const url = "myapp://login?username=test&password=1234";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.navigate({ url }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/url`,
      payload: { url }
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const url = "myapp://login?username=test&password=1234";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.navigate({ sessionId, url }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/url`,
      payload: { url }
    });
  });
};

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("opens deep links via Safari (iOS 13)", async () => {
    const url = "myapp://login?username=test&password=1234";
    const sessionId = "sessionId";
    const urlInputRef = createFindElementMock({ elementId: "elementId2" });
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce() // Close app
      .mockResolvedValueOnce() // Launch app
      .mockResolvedValueOnce(true) // Keyboard visible?
      .mockResolvedValueOnce(urlInputRef) // Url input.
      .mockResolvedValueOnce() // Type url.
      .mockResolvedValueOnce() // Tap return key.
      .mockResolvedValueOnce("Open url?") // Alert visible.
      .mockResolvedValueOnce(); // Accept alert.

    await expect(appiumService.navigate({ url }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(8);
    expect(requestHelpers.request).toHaveBeenNthCalledWith(1, {
      method: "POST",
      path: `/session/${sessionId}/appium/device/terminate_app`,
      payload: { appId: "com.apple.mobilesafari" }
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(2, {
      method: "POST",
      path: `/session/${sessionId}/appium/device/activate_app`,
      payload: { appId: "com.apple.mobilesafari" }
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(3, {
      method: "GET",
      path: `/session/${sessionId}/appium/device/is_keyboard_shown`
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(4, {
      method: "POST",
      path: `/session/${sessionId}/element`,
      payload: {
        using: "-ios predicate string",
        value: `type == "XCUIElementTypeTextField" && name CONTAINS "URL"`
      }
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(5, {
      method: "POST",
      path: `/session/${sessionId}/element/${urlInputRef.ELEMENT}/value`,
      payload: { value: url.split("") }
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(6, {
      method: "POST",
      path: `/session/${sessionId}/element/${urlInputRef.ELEMENT}/value`,
      payload: { value: ["\n"] }
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(7, {
      method: "GET",
      path: `/session/${sessionId}/alert/text`
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(8, {
      method: "POST",
      path: `/session/${sessionId}/alert/accept`
    });
  });

  it("opens deep links via Safari (iOS 12)", async () => {
    const url = "myapp://login?username=test&password=1234";
    const sessionId = "sessionId";
    const urlButtonRef = createFindElementMock({ elementId: "elementId" });
    const urlInputRef = createFindElementMock({ elementId: "elementId2" });
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request")
      .mockResolvedValueOnce() // Close app
      .mockResolvedValueOnce() // Launch app
      .mockResolvedValueOnce(false) // Keyboard visible?
      .mockResolvedValueOnce(urlButtonRef) // Url button.
      .mockResolvedValueOnce() // Click url button.
      .mockResolvedValueOnce(urlInputRef) // Url input.
      .mockResolvedValueOnce() // Type url.
      .mockResolvedValueOnce() // Tap return key.
      .mockResolvedValueOnce("Open url?") // Alert visible.
      .mockResolvedValueOnce(); // Accept alert.

    await expect(appiumService.navigate({ url }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(10);
    expect(requestHelpers.request).toHaveBeenNthCalledWith(1, {
      method: "POST",
      path: `/session/${sessionId}/appium/device/terminate_app`,
      payload: { appId: "com.apple.mobilesafari" }
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(2, {
      method: "POST",
      path: `/session/${sessionId}/appium/device/activate_app`,
      payload: { appId: "com.apple.mobilesafari" }
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(3, {
      method: "GET",
      path: `/session/${sessionId}/appium/device/is_keyboard_shown`
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(4, {
      method: "POST",
      path: `/session/${sessionId}/element`,
      payload: {
        using: "-ios predicate string",
        value: `type == "XCUIElementTypeButton" && name == "URL"`
      }
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(5, {
      method: "POST",
      path: `/session/${sessionId}/element/${urlButtonRef.ELEMENT}/click`
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(6, {
      method: "POST",
      path: `/session/${sessionId}/element`,
      payload: {
        using: "-ios predicate string",
        value: `type == "XCUIElementTypeTextField" && name CONTAINS "URL"`
      }
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(7, {
      method: "POST",
      path: `/session/${sessionId}/element/${urlInputRef.ELEMENT}/value`,
      payload: { value: url.split("") }
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(8, {
      method: "POST",
      path: `/session/${sessionId}/element/${urlInputRef.ELEMENT}/value`,
      payload: { value: ["\n"] }
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(9, {
      method: "GET",
      path: `/session/${sessionId}/alert/text`
    });
    expect(requestHelpers.request).toHaveBeenNthCalledWith(10, {
      method: "POST",
      path: `/session/${sessionId}/alert/accept`
    });
  });
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));
  runAndroidAndNativeTests();
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));
  runAndroidAndNativeTests();
});