// TODO: Rewrite to new ensure use cases are supported.
// const appiumServer = require("../helpers/appiumServer");
// const fetch = require("node-fetch");
//
// jest.mock("../../src/session");
// const mockSession = require("../helpers/mockSession");
//
// const { element, by } = require("../../");
// const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
//
// const testPlatform = (platformName) => {
//   const inputElementType = platformName === "iOS"
//     ? "XCUIElementTypeTextField"
//     : "android.widget.EditText";
//
//   it("returns the element's value", async () => {
//     appiumServer.mockFindElement({elementId: "elementId"});
//     appiumServer.mockElementType({platformName, elementId: "elementId", type: inputElementType});
//     appiumServer.mockElementValue({elementId: "elementId", value: "Hello World!"});
//     appiumServer.mockElementText({elementId: "elementId", text: "Hello World!"});
//
//     const result = await element(by.label("text-input")).getValue();
//
//     expect(fetch).toHaveBeenCalledTimes(3);
//     expect(result).toEqual("Hello World!");
//   });
//
//   it("correctly propagates errors", async () => {
//     appiumServer.mockFindElement({status: 7, elementId: "elementId"});
//
//     await expect(element(by.label("text-input")).getValue())
//       .rejects.toThrow(ElementNotFoundError);
//
//     expect(fetch).toHaveBeenCalledTimes(1);
//   });
//
//   it("correctly handles value attribute request errors", async () => {
//     appiumServer.mockFindElement({elementId: "elementId"});
//     appiumServer.mockElementType({platformName, elementId: "elementId", type: inputElementType});
//     appiumServer.mockElementValue({elementId: "elementId", status: 3});
//     appiumServer.mockElementText({elementId: "elementId", status: 3});
//
//     await expect(element(by.label("text-input")).getValue())
//       .rejects.toThrow(new ElementActionError("Failed to get value for element."));
//
//     expect(fetch).toHaveBeenCalledTimes(3);
//   });
// };
//
// afterEach(() => {
//   appiumServer.resetMocks();
// });
//
// describe("iOS", () => {
//   beforeEach(() => {
//     mockSession({
//       sessionId: "sessionId",
//       platformName: "iOS"
//     });
//   });
//
//   testPlatform("iOS");
//
//   it("returns true for native switch elements with a value of '1'", async () => {
//     appiumServer.mockFindElement({elementId: "elementId"});
//     appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeSwitch"});
//     appiumServer.mockElementValue({elementId: "elementId", value: "1"});
//
//     const result = await element(by.label("switch")).getValue();
//
//     expect(fetch).toHaveBeenCalledTimes(3);
//     expect(result).toEqual(true);
//   });
//
//   it("returns false for native switch elements with a value of '0'", async () => {
//     appiumServer.mockFindElement({elementId: "elementId"});
//     appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeSwitch"});
//     appiumServer.mockElementValue({elementId: "elementId", value: "0"});
//
//     const result = await element(by.label("switch")).getValue();
//
//     expect(fetch).toHaveBeenCalledTimes(3);
//     expect(result).toEqual(false);
//   });
//
//   it("returns true for native buttons with a value of '1'", async () => {
//     appiumServer.mockFindElement({elementId: "elementId"});
//     appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeButton"});
//     appiumServer.mockElementValue({elementId: "elementId", value: "1"});
//
//     const result = await element(by.label("slider")).getValue();
//
//     expect(fetch).toHaveBeenCalledTimes(3);
//     expect(result).toEqual(true);
//   });
//
//   it("returns false for native buttons with a value of '0'", async () => {
//     appiumServer.mockFindElement({elementId: "elementId"});
//     appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeButton"});
//     appiumServer.mockElementValue({elementId: "elementId", value: "0"});
//
//     const result = await element(by.label("slider")).getValue();
//
//     expect(fetch).toHaveBeenCalledTimes(3);
//     expect(result).toEqual(false);
//   });
//
//   it("correctly handles native slider element value", async () => {
//     appiumServer.mockFindElement({elementId: "elementId"});
//     appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeSlider"});
//     appiumServer.mockElementValue({elementId: "elementId", value: "50%"});
//
//     const result = await element(by.label("slider")).getValue({sliderRange: [0, 5]});
//
//     expect(fetch).toHaveBeenCalledTimes(3);
//     expect(result).toEqual(2.5);
//   });
//
//   it("throws if 'sliderRange' is not provided for native slider elements", async () => {
//     appiumServer.mockFindElement({elementId: "elementId"});
//     appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeSlider"});
//     appiumServer.mockElementValue({elementId: "elementId", value: "50%"});
//
//     await expect(element(by.label("slider")).getValue())
//       .rejects.toThrow(new Error("You must provide a 'sliderRange' option when dealing with slider elements."));
//
//     expect(fetch).toHaveBeenCalledTimes(3);
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
//   testPlatform("Android");
//
//   it("correctly handles native switch element value (ON)", async () => {
//     appiumServer.mockFindElement({elementId: "elementId"});
//     appiumServer.mockElementType({platformName: "Android", elementId: "elementId", type: "android.widget.Switch"});
//     appiumServer.mockElementText({elementId: "elementId", text: "ON"});
//
//     const result = await element(by.label("switch")).getValue();
//
//     expect(fetch).toHaveBeenCalledTimes(3);
//     expect(result).toEqual(true);
//   });
//
//   it("correctly handles native switch element value (OFF)", async () => {
//     appiumServer.mockFindElement({elementId: "elementId"});
//     appiumServer.mockElementType({platformName: "Android", elementId: "elementId", type: "android.widget.Switch"});
//     appiumServer.mockElementText({elementId: "elementId", text: "OFF"});
//
//     const result = await element(by.label("switch")).getValue();
//
//     expect(fetch).toHaveBeenCalledTimes(3);
//     expect(result).toEqual(false);
//   });
//
//   it("correctly handles native slider element value", async () => {
//     appiumServer.mockFindElement({elementId: "elementId"});
//     appiumServer.mockElementType({platformName: "Android", elementId: "elementId", type: "android.widget.SeekBar"});
//     appiumServer.mockElementText({elementId: "elementId", text: "2.5"});
//
//     const result = await element(by.label("slider")).getValue({sliderRange: [0, 5]});
//
//     expect(fetch).toHaveBeenCalledTimes(3);
//     expect(result).toEqual(2.5);
//   });
// });