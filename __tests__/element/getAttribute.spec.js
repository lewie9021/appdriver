const appiumServer = require("../helpers/appiumServer");

const { element, by } = require("../../");
const { ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("correctly handles attribute request errors", async () => {
  const attributeName = "name";

  const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
  const elementAttributeMock = appiumServer.mockElementAttribute({status: 3, elementId: "elementId", name: attributeName});

  await expect(element(by.label("box")).getAttribute(attributeName))
    .rejects.toThrow(new ElementActionError(`Failed to get element '${attributeName}' attribute.`));

  expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
  expect(appiumServer.getCalls(elementAttributeMock)).toHaveLength(1);
});

it.todo("handles case when element doesn't exists");

describe("iOS", () => {
  describe("UID", () => {
    const attributeName = "UID";

    it("returns the 'UID' attribute as a string", async () => {
      const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
      const elementAttributeMock = appiumServer.mockElementAttribute({elementId: "elementId", name: attributeName, value: "UID"});

      const result = await element(by.label("box")).getAttribute(attributeName);

      expect(result).toEqual("UID");
      expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
      expect(appiumServer.getCalls(elementAttributeMock)).toHaveLength(1);
    });

    it("correctly handles request error", async () => {
      const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
      const elementAttributeMock = appiumServer.mockElementAttribute({status: 3, elementId: "elementId", name: attributeName});

      await expect(element(by.label("box")).getAttribute(attributeName))
        .rejects.toThrow(new ElementActionError(`Failed to get element '${attributeName}' attribute.`));

      expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
      expect(appiumServer.getCalls(elementAttributeMock)).toHaveLength(1);
    });
  });
});