// TODO: Rewrite to ensure use cases are covered.
it.todo("Rewrite to ensure use cases are covered.");

// jest.mock("../../src/session");
// const mockSession = require("../helpers/mockSession");
//
// const appiumServer = require("../helpers/appiumServer");
//
// const { element, by } = require("../../");
// const { ElementActionError } = require("../../src/errors");
//
// afterEach(() => {
//   appiumServer.resetMocks();
// });
//
// it("throws if an invalid attribute is passed", async () => {
//   const name = "invalid";
//
//   const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
//   const elementAttributeMock = appiumServer.mockElementAttribute({status: 3, elementId: "elementId", name});
//
//   await expect(element(by.label("box")).getAttribute(name))
//     .rejects.toThrowError(ElementActionError);
//
//   expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
//   expect(appiumServer.getCalls(elementAttributeMock)).toHaveLength(0);
// });
//
// it("correctly handles attribute request errors", async () => {
//   const attributeName = "name";
//
//   const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
//   const elementAttributeMock = appiumServer.mockElementAttribute({status: 3, elementId: "elementId", name: attributeName});
//
//   await expect(element(by.label("box")).getAttribute(attributeName))
//     .rejects.toThrow(new ElementActionError(`Failed to get '${attributeName}' attribute of element.`));
//
//   expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
//   expect(appiumServer.getCalls(elementAttributeMock)).toHaveLength(1);
// });
//
// it.todo("handles case when element doesn't exists");
//
// const testAttribute = (suiteTitle, { attribute, response, expected }) => {
//   describe(suiteTitle, () => {
//     it(`returns the '${attribute}' attribute as a ${typeof expected}`, async () => {
//       const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
//       const elementAttributeMock = appiumServer.mockElementAttribute({elementId: "elementId", name: response.name, value: response.value});
//
//       const result = await element(by.label("box")).getAttribute(attribute);
//
//       expect(result).toEqual(expected);
//       expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
//       expect(appiumServer.getCalls(elementAttributeMock)).toHaveLength(1);
//     });
//
//     it("correctly handles request error", async () => {
//       const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
//       const elementAttributeMock = appiumServer.mockElementAttribute({status: 3, elementId: "elementId", name: response.name});
//
//       await expect(element(by.label("box")).getAttribute(attribute))
//         .rejects.toThrow(new ElementActionError(`Failed to get '${attribute}' attribute of element.`));
//
//       expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
//       expect(appiumServer.getCalls(elementAttributeMock)).toHaveLength(1);
//     });
//   });
// };
//
// describe("iOS", () => {
//   beforeEach(() => {
//     mockSession({
//       sessionId: "sessionId",
//       platformName: "iOS"
//     });
//   });
//
//   testAttribute("uid", {
//     attribute: "uid",
//     response: {
//       name: "UID",
//       value: "45000000-0000-0000-5F0B-010000000000"
//     },
//     expected: "45000000-0000-0000-5F0B-010000000000"
//   });
//
//   testAttribute("accessibilityContainer", {
//     attribute: "accessibilityContainer",
//     response: {
//       name: "accessibilityContainer",
//       value: "true"
//     },
//     expected: true
//   });
//
//   testAttribute("accessible", {
//     attribute: "accessible",
//     response: {
//       name: "accessible",
//       value: "false"
//     },
//     expected: false
//   });
//
//   testAttribute("accessible", {
//     attribute: "accessible",
//     response: {
//       name: "accessible",
//       value: "false"
//     },
//     expected: false
//   });
//
//   testAttribute("enabled", {
//     attribute: "enabled",
//     response: {
//       name: "enabled",
//       value: "false"
//     },
//     expected: false
//   });
//
//   testAttribute("label", {
//     attribute: "label",
//     response: {
//       name: "label",
//       value: "Label"
//     },
//     expected: "Label"
//   });
//
//   testAttribute("name", {
//     attribute: "name",
//     response: {
//       name: "name",
//       value: "button"
//     },
//     expected: "button"
//   });
//
//   testAttribute("rect", {
//     attribute: "rect",
//     response: {
//       name: "rect",
//       value: `{"y":230,"x":16,"width":343,"height":49}`
//     },
//     expected: {
//       y: 230,
//       x: 16,
//       width: 343,
//       height: 49
//     }
//   });
//
//   testAttribute("type", {
//     attribute: "type",
//     response: {
//       name: "type",
//       value: "XCUIElementTypeTextField"
//     },
//     expected: "XCUIElementTypeTextField"
//   });
//
//   testAttribute("value", {
//     attribute: "value",
//     response: {
//       name: "value",
//       value: "Text Input Value"
//     },
//     expected: "Text Input Value"
//   });
//
//   testAttribute("visible", {
//     attribute: "visible",
//     response: {
//       name: "visible",
//       value: "true"
//     },
//     expected: true
//   });
// });
//
// describe("Android", () => {
//   beforeEach(() => {
//     mockSession({
//       sessionId: "sessionId",
//       platformName: "Android"
//     });
//   });
//
//   // TODO: checkable.
//   // TODO: checked.
//
//   testAttribute("className", {
//     attribute: "className",
//     response: {
//       name: "className",
//       value: "android.widget.EditText"
//     },
//     expected: "android.widget.EditText"
//   });
//
//   testAttribute("clickable", {
//     attribute: "clickable",
//     response: {
//       name: "clickable",
//       value: "false"
//     },
//     expected: false
//   });
//
//   testAttribute("contentDescription", {
//     attribute: "contentDescription",
//     response: {
//       name: "contentDescription",
//       value: "button"
//     },
//     expected: "button"
//   });
//
//   testAttribute("enabled", {
//     attribute: "clickable",
//     response: {
//       name: "clickable",
//       value: "true"
//     },
//     expected: true
//   });
//
//   testAttribute("focusable", {
//     attribute: "focusable",
//     response: {
//       name: "focusable",
//       value: "false"
//     },
//     expected: false
//   });
//
//   testAttribute("focused", {
//     attribute: "focused",
//     response: {
//       name: "focused",
//       value: "true"
//     },
//     expected: true
//   });
//
//   testAttribute("longClickable", {
//     attribute: "longClickable",
//     response: {
//       name: "longClickable",
//       value: "false"
//     },
//     expected: false
//   });
//
//   testAttribute("resourceId", {
//     attribute: "resourceId",
//     response: {
//       name: "resourceId",
//       value: "element-resource-id"
//     },
//     expected: "element-resource-id"
//   });
//
//   testAttribute("scrollable", {
//     attribute: "scrollable",
//     response: {
//       name: "scrollable",
//       value: "true"
//     },
//     expected: true
//   });
//
//   testAttribute("selectionStart", {
//     attribute: "selectionStart",
//     response: {
//       name: "selection-start",
//       value: "6"
//     },
//     expected: 6
//   });
//
//   testAttribute("selectionEnd", {
//     attribute: "selectionEnd",
//     response: {
//       name: "selection-end",
//       value: "10"
//     },
//     expected: 10
//   });
//
//   testAttribute("selected", {
//     attribute: "selected",
//     response: {
//       name: "selected",
//       value: "false"
//     },
//     expected: false
//   });
//
//   testAttribute("text", {
//     attribute: "text",
//     response: {
//       name: "text",
//       value: "Text Input Value"
//     },
//     expected: "Text Input Value"
//   });
//
//   testAttribute("bounds", {
//     attribute: "bounds",
//     response: {
//       name: "bounds",
//       value: "[42,252][1038,372]"
//     },
//     expected: {
//       x1: 42,
//       y1: 252,
//       x2: 1038,
//       y2: 372
//     }
//   });
//
//   testAttribute("displayed", {
//     attribute: "displayed",
//     response: {
//       name: "displayed",
//       value: "true"
//     },
//     expected: true
//   });
//
//   testAttribute("contentSize", {
//     attribute: "contentSize",
//     response: {
//       name: "contentSize",
//       value: "{\"width\":1080,\"height\":1584,\"top\":210,\"left\":0,\"scrollableOffset\":2545,\"touchPadding\":21}"
//     },
//     expected: {
//       width: 1080,
//       height: 1584,
//       top: 210,
//       left: 0,
//       scrollableOffset: 2545,
//       touchPadding: 21
//     }
//   });
// });