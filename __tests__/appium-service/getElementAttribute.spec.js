jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const requestHelpers = require("../../src/worker/services/request");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform } = require("../helpers");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("optionally accepts a sessionId", async () => {
  setPlatform("iOS");

  const sessionId = "newSessionId";
  const ref = createFindElementMock();
  const attribute = "selected";
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
  jest.spyOn(requestHelpers, "request").mockResolvedValue("true");

  await appiumService.getElementAttribute({ sessionId, element: ref, attribute });

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/${attribute}`
  });
});

const testAttribute = ({ attribute, rawValue, value }) => {
  it(`supports '${attribute}' attribute`, async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue(rawValue);

    await expect(appiumService.getElementAttribute({ element: ref, attribute }))
      .resolves.toEqual(value);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/${attribute}`
    });
  });
};

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  testAttribute({
    attribute: "UID",
    rawValue: "6A000000-0000-0000-D847-000000000000",
    value: "6A000000-0000-0000-D847-000000000000"
  });

  testAttribute({
    attribute: "accessibilityContainer",
    rawValue: "false",
    value: false
  });

  testAttribute({
    attribute: "accessible",
    rawValue: "true",
    value: true
  });

  testAttribute({
    attribute: "enabled",
    rawValue: "true",
    value: true
  });

  // TODO: Get 500 error from Appium: "Invalid type in JSON write (NSConcreteValue)".
  // testAttribute({
  //   attribute: "frame",
  //   rawValue: null,
  //   value: null
  // });

  testAttribute({
    attribute: "label",
    rawValue: "test",
    value: "test"
  });

  testAttribute({
    attribute: "name",
    rawValue: "button",
    value: "button"
  });

  testAttribute({
    attribute: "rect",
    rawValue: `{ "y": 105, "x": 17, "width": 342, "height": 33 }`,
    value: { y: 105, x: 17, width: 342, height: 33 }
  });

  testAttribute({
    attribute: "selected",
    rawValue: "false",
    value: false
  });

  testAttribute({
    attribute: "type",
    rawValue: "XCUIElementTypeTextField",
    value: "XCUIElementTypeTextField"
  });

  // Note: null when input is empty otherwise a string.
  testAttribute({
    attribute: "value",
    rawValue: null,
    value: null
  });

  testAttribute({
    attribute: "visible",
    rawValue: "true",
    value: true
  });

  testAttribute({
    attribute: "wdAccessibilityContainer",
    rawValue: "false",
    value: false
  });

  testAttribute({
    attribute: "wdAccessible",
    rawValue: "true",
    value: true
  });

  testAttribute({
    attribute: "wdEnabled",
    rawValue: "true",
    value: true
  });

  // TODO: Get 500 error from Appium: "Invalid type in JSON write (NSConcreteValue)".
  // testAttribute({
  //   attribute: "wdFrame",
  //   rawValue: null,
  //   value: null
  // });

  testAttribute({
    attribute: "wdLabel",
    rawValue: "test",
    value: "test"
  });

  testAttribute({
    attribute: "wdName",
    rawValue: "button",
    value: "button"
  });

  testAttribute({
    attribute: "wdRect",
    rawValue: `{ "y": 105, "x": 17, "width": 342, "height": 33 }`,
    value: { y: 105, x: 17, width: 342, height: 33 }
  });

  testAttribute({
    attribute: "wdSelected",
    rawValue: "false",
    value: false
  });

  testAttribute({
    attribute: "wdType",
    rawValue: "XCUIElementTypeTextField",
    value: "XCUIElementTypeTextField"
  });

  // Note: null when input is empty otherwise a string.
  testAttribute({
    attribute: "wdValue",
    rawValue: null,
    value: null
  });

  testAttribute({
    attribute: "wdVisible",
    rawValue: "true",
    value: true
  });


  testAttribute({
    attribute: "wdUID",
    rawValue: "6A000000-0000-0000-D847-000000000000",
    value: "6A000000-0000-0000-D847-000000000000"
  });
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));

  testAttribute({
    attribute: "checkable",
    rawValue: "true",
    value: true
  });

  testAttribute({
    attribute: "checked",
    rawValue: "false",
    value: false
  });

  testAttribute({
    attribute: "class",
    rawValue: "android.widget.EditText",
    value: "android.widget.EditText"
  });

  testAttribute({
    attribute: "className",
    rawValue: "android.widget.EditText",
    value: "android.widget.EditText"
  });

  testAttribute({
    attribute: "clickable",
    rawValue: "true",
    value: true
  });

  testAttribute({
    attribute: "content-desc",
    rawValue: "button",
    value: "button"
  });

  testAttribute({
    attribute: "contentDescription",
    rawValue: "button",
    value: "button"
  });

  testAttribute({
    attribute: "enabled",
    rawValue: "false",
    value: false
  });

  testAttribute({
    attribute: "focusable",
    rawValue: "true",
    value: true
  });

  testAttribute({
    attribute: "focused",
    rawValue: "false",
    value: false
  });

  testAttribute({
    attribute: "long-clickable",
    rawValue: "true",
    value: true
  });

  testAttribute({
    attribute: "longClickable",
    rawValue: "true",
    value: true
  });

  testAttribute({
    attribute: "package",
    rawValue: "com.nativedemoapp",
    value: "com.nativedemoapp"
  });

  testAttribute({
    attribute: "password",
    rawValue: "false",
    value: false
  });

  testAttribute({
    attribute: "resource-id",
    rawValue: null,
    value: null
  });

  testAttribute({
    attribute: "resourceId",
    rawValue: null,
    value: null
  });

  testAttribute({
    attribute: "scrollable",
    rawValue: "true",
    value: true
  });

  testAttribute({
    attribute: "selection-start",
    rawValue: null,
    value: null
  });

  testAttribute({
    attribute: "selection-end",
    rawValue: null,
    value: null
  });

  testAttribute({
    attribute: "selected",
    rawValue: "false",
    value: false
  });

  testAttribute({
    attribute: "name",
    rawValue: "test",
    value: "test"
  });

  testAttribute({
    attribute: "text",
    rawValue: "test",
    value: "test"
  });

  testAttribute({
    attribute: "bounds",
    rawValue: "[42,252][1038,372]",
    value: { x1: 42, y1: 252, x2: 1038, y2: 372 }
  });

  testAttribute({
    attribute: "displayed",
    rawValue: "true",
    value: true
  });

  testAttribute({
    attribute: "contentSize",
    rawValue: `{ "width": 1080, "height": 1584, "top": 210, "left": 0, "scrollableOffset": 2545, "touchPadding": 21 }`,
    value: { width: 1080, height: 1584, top: 210, left: 0, scrollableOffset: 2545, touchPadding: 21 }
  });
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));

  it("supports any attribute", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const attribute = "class";
    const value = "test";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue(value);

    await expect(appiumService.getElementAttribute({ element: ref, attribute }))
      .resolves.toEqual(value);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/${attribute}`
    });
  });
});