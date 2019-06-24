const { NotImplementedError } = require("./errors");
const { getValueType, isPromise } = require("./utils");

const displayValue = (value) => {
  const valueType = getValueType(value);

  switch (valueType) {
    case "string":
      return `'${value}'`;
    // case "object":
    //   return JSON.stringify(value);
    default:
      return value;
  }

  return valueType === "string"
    ? `'${value}'`
    : value;
};

class Expect {
  constructor(value) {
    this.value = value;
  }

  async toHaveText(value) {
    const elementText = await this.value.getText();

    if (elementText !== value) {
      throw new Error(`Expected element to have text '${value}' but instead got '${elementText}'.`);
    }
  }

  async toHaveValue(value, options) {
    const elementText = await this.value.getValue(options);

    if (elementText !== value) {
      throw new Error(`Expected element to have value '${value}' but instead got '${elementText}'.`);
    }
  }

  async toBeVisible() {
    const elementIsVisible = await this.value.isVisible();

    if (elementIsVisible !== true) {
      throw new Error(`Expected element to be visible but instead got '${elementIsVisible}'.`);
    }
  }

  async toExist() {
    const elementExists = await this.value.exists();

    if (elementExists !== true) {
      throw new Error(`Expected element to exist.`);
    }
  }

  async toEqual(value) {
    const supportedTypes = ["number", "string", "boolean", "null", "undefined", "promise"];
    const isPromiseValue = isPromise(this.value);
    const actualValue = await this.value;
    const valueType = getValueType(actualValue);

    if (!supportedTypes.includes(valueType)) {
      throw new NotImplementedError();
    }

    if (actualValue !== value) {
      throw new Error(`Expected ${isPromiseValue ? "promise" : valueType} to equal ${displayValue(value)} but instead got ${displayValue(actualValue)}.`);
    }
  }

  async toHaveLength(length) {
    const supportedTypes = ["array", "object", "string"];
    const valueType = getValueType(this.value);
    const valueLength = supportedTypes.includes(valueType)
      ? this.value.length
      : 0;

    if (valueLength !== length) {
      throw new Error(`Expected ${valueType} to have length '${length}' but instead got '${valueLength}'.`);
    }
  }
}

const expect = (value) => {
  return new Expect(value);
};

module.exports = expect;