const { getValueType } = require("./utils");

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