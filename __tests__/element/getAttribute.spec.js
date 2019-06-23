const appiumServer = require("../helpers/appiumServer");

const { element, by } = require("../../");
const { ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("throws if an invalid attribute is passed", async () => {
  const name = "invalid";

  const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
  const elementAttributeMock = appiumServer.mockElementAttribute({status: 3, elementId: "elementId", name});

  await expect(element(by.label("box")).getAttribute(name))
    .rejects.toThrowError(ElementActionError);

  expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
  expect(appiumServer.getCalls(elementAttributeMock)).toHaveLength(0);
});

it("correctly handles attribute request errors", async () => {
  const attributeName = "name";

  const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
  const elementAttributeMock = appiumServer.mockElementAttribute({status: 3, elementId: "elementId", name: attributeName});

  await expect(element(by.label("box")).getAttribute(attributeName))
    .rejects.toThrow(new ElementActionError(`Failed to get '${attributeName}' attribute of element.`));

  expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
  expect(appiumServer.getCalls(elementAttributeMock)).toHaveLength(1);
});

it.todo("handles case when element doesn't exists");

const testAttribute = (suiteTitle, { attribute, response, expected }) => {
  describe(suiteTitle, () => {
    it("returns the 'UID' attribute as a string", async () => {
      const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
      const elementAttributeMock = appiumServer.mockElementAttribute({elementId: "elementId", name: response.name, value: response.value});

      const result = await element(by.label("box")).getAttribute(attribute);

      expect(result).toEqual(expected);
      expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
      expect(appiumServer.getCalls(elementAttributeMock)).toHaveLength(1);
    });

    it("correctly handles request error", async () => {
      const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
      const elementAttributeMock = appiumServer.mockElementAttribute({status: 3, elementId: "elementId", name: response.name});

      await expect(element(by.label("box")).getAttribute(attribute))
        .rejects.toThrow(new ElementActionError(`Failed to get '${attribute}' attribute of element.`));

      expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
      expect(appiumServer.getCalls(elementAttributeMock)).toHaveLength(1);
    });
  });
};

describe("iOS", () => {
  testAttribute("uid", {
    attribute: "uid",
    response: {
      name: "UID",
      value: "45000000-0000-0000-5F0B-010000000000"
    },
    expected: "45000000-0000-0000-5F0B-010000000000"
  });

  testAttribute("accessibilityContainer", {
    attribute: "accessibilityContainer",
    response: {
      name: "accessibilityContainer",
      value: "true"
    },
    expected: true
  });

  testAttribute("accessible", {
    attribute: "accessible",
    response: {
      name: "accessible",
      value: "false"
    },
    expected: false
  });

  testAttribute("accessible", {
    attribute: "accessible",
    response: {
      name: "accessible",
      value: "false"
    },
    expected: false
  });

  testAttribute("enabled", {
    attribute: "enabled",
    response: {
      name: "enabled",
      value: "false"
    },
    expected: false
  });

  testAttribute("label", {
    attribute: "label",
    response: {
      name: "label",
      value: "Label"
    },
    expected: "Label"
  });
});