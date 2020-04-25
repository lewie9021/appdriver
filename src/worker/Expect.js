const { NotImplementedError } = require("./errors");
const { getValueType, isPromise, isRegex } = require("../utils");

const displayValue = (value) => {
  const valueType = getValueType(value);

  switch (valueType) {
    case "string": return `'${value}'`;
    case "array": return JSON.stringify(value);
    // Avoids potentially unreadable messages.
    // Maybe write a parser that displays a truncated version?
    case "object": return "object";
    default: return value;
  }
};

class Expect {
  constructor(value, invert = false) {
    this.value = value;
    this._invert = invert;
  }

  _assert({ pass, message }) {
    const passed = this._invert ? !pass : pass;

    if (!passed) {
      throw new Error(message(this._invert));
    }
  }

  get not() {
    return new Expect(this.value, !this._invert);
  }

  async toHaveText(text, options) {
    const elementText = await this.value.getText(options);

    if (isRegex(text)) {
      return this._assert({
        pass: text.test(elementText),
        message: (inverted) => (
          inverted
            ? `Expected element not to have text match '${text}'.`
            : `Expected element to have text match '${text}'.`
        )
      });
    }

    return this._assert({
      pass: elementText === text,
      message: (inverted) => (
        inverted
          ? `Expected element not to have text '${text}'.`
          : `Expected element to have text '${text}' but instead got '${elementText}'.`
      )
    });
  }

  async toHaveValue(value) {
    const elementValue = await this.value.getValue();

    return this._assert({
      pass: elementValue === value,
      message: (inverted) => (
        inverted
          ? `Expected element not to have value '${value}'.`
          : `Expected element to have value '${value}' but instead got '${elementValue}'.`
      )
    });
  }

  async toBeVisible() {
    const elementIsVisible = await this.value.isVisible();

    return this._assert({
      pass: elementIsVisible === true,
      message: (inverted) => (
        inverted
          ? `Expected element not to be visible.`
          : `Expected element to be visible.`
      )
    });
  }

  async toBeDisabled() {
    const elementIsDisabled = await this.value.isDisabled();

    return this._assert({
      pass: elementIsDisabled === true,
      message: (inverted) => (
        inverted
          ? `Expected element not to be disabled.`
          : `Expected element to be disabled.`
      )
    });
  }

  async toBeSelected() {
    const elementIsSelected = await this.value.isSelected();

    return this._assert({
      pass: elementIsSelected === true,
      message: (inverted) => (
        inverted
          ? `Expected element not to be selected.`
          : `Expected element to be selected.`
      )
    });
  }

  async toBeFocused() {
    const elementIsFocused = await this.value.isFocused();

    return this._assert({
      pass: elementIsFocused === true,
      message: (inverted) => (
        inverted
          ? `Expected element not to be focused.`
          : `Expected element to be focused.`
      )
    });
  }

  async toExist() {
    const elementExists = await this.value.exists();

    return this._assert({
      pass: elementExists === true,
      message: (inverted) => (
        inverted
          ? `Expected element not to exist.`
          : `Expected element to exist.`
      )
    });
  }

  async toEqual(value) {
    const supportedTypes = [ "number", "string", "boolean", "null", "undefined", "promise" ];
    const isPromiseValue = isPromise(this.value);
    const actualValue = await this.value;
    const valueType = getValueType(actualValue);

    if (!supportedTypes.includes(valueType)) {
      throw new NotImplementedError();
    }

    const expectedValueText = displayValue(value);
    const actualValueText = displayValue(actualValue);
    const valueTypeText = isPromiseValue ? "promise" : valueType;

    return this._assert({
      pass: actualValue === value,
      message: (inverted) => (
        inverted
          ? `Expected ${valueTypeText} not to equal ${expectedValueText}.`
          : `Expected ${valueTypeText} to equal ${expectedValueText} but instead got ${actualValueText}.`
      )
    });
  }

  async toHaveLength(length) {
    const supportedTypes = [ "array", "object", "string" ];
    const valueType = getValueType(this.value);

    if (!supportedTypes.includes(valueType)) {
      throw new NotImplementedError();
    }

    const actualLength = this.value.length || 0;

    return this._assert({
      pass: actualLength === length,
      message: (inverted) => (
        inverted
          ? `Expected ${valueType} not to have length '${length}'.`
          : `Expected ${valueType} to have length '${length}' but instead got '${actualLength}'.`
      )
    });
  }

  async toMatch(pattern) {
    const supportedTypes = ["string"];
    const valueType = getValueType(this.value);

    if (!supportedTypes.includes(valueType)) {
      throw new NotImplementedError();
    }

    const displayValueText = displayValue(this.value);

    return this._assert({
      pass: pattern.test(this.value),
      message: (inverted) => (
        inverted
          ? `Expected ${displayValueText} not to match '${pattern}'.`
          : `Expected ${displayValueText} to match '${pattern}'.`
      )
    });
  }

  async toBeTruthy() {
    const actualValue = await this.value;
    const valueTypeText = isPromise(this.value) ? "promise" : displayValue(actualValue);

    return this._assert({
      pass: Boolean(actualValue),
      message: (inverted) => (
        inverted
          ? `Expected ${valueTypeText} not to be truthy.`
          : `Expected ${valueTypeText} to be truthy.`
      )
    });
  }

  async toBeFalsy() {
    const actualValue = await this.value;
    const valueTypeText = isPromise(this.value) ? "promise" : displayValue(actualValue);

    return this._assert({
      pass: !Boolean(actualValue),
      message: (inverted) => (
        inverted
          ? `Expected ${valueTypeText} not to be falsy.`
          : `Expected ${valueTypeText} to be falsy.`
      )
    });
  }

  async toBeLessThan(value) {
    const supportedTypes = ["number"];
    const valueType = getValueType(this.value);

    if (!supportedTypes.includes(valueType)) {
      throw new NotImplementedError();
    }

    const displayValueText = displayValue(this.value);

    return this._assert({
      pass: this.value < value,
      message: (inverted) => (
        inverted
          ? `Expected ${displayValueText} not to be less than ${value}.`
          : `Expected ${displayValueText} to be less than ${value}.`
      )
    });
  }

  async toBeLessThanOrEqual(value) {
    const supportedTypes = ["number"];
    const valueType = getValueType(this.value);

    if (!supportedTypes.includes(valueType)) {
      throw new NotImplementedError();
    }

    const displayValueText = displayValue(this.value);

    return this._assert({
      pass: this.value <= value,
      message: (inverted) => (
        inverted
          ? `Expected ${displayValueText} not to be less than or equal to ${value}.`
          : `Expected ${displayValueText} to be less than or equal to ${value}.`
      )
    });
  }

  async toBeGreaterThan(value) {
    const supportedTypes = ["number"];
    const valueType = getValueType(this.value);

    if (!supportedTypes.includes(valueType)) {
      throw new NotImplementedError();
    }

    const displayValueText = displayValue(this.value);

    return this._assert({
      pass: this.value > value,
      message: (inverted) => (
        inverted
          ? `Expected ${displayValueText} not to be greater than ${value}.`
          : `Expected ${displayValueText} to be greater than ${value}.`
      )
    });
  }

  async toBeGreaterThanOrEqual(value) {
    const supportedTypes = ["number"];
    const valueType = getValueType(this.value);

    if (!supportedTypes.includes(valueType)) {
      throw new NotImplementedError();
    }

    const displayValueText = displayValue(this.value);

    return this._assert({
      pass: this.value >= value,
      message: (inverted) => (
        inverted
          ? `Expected ${displayValueText} not to be greater than or equal to ${value}.`
          : `Expected ${displayValueText} to be greater than or equal to ${value}.`
      )
    });
  }
}

module.exports = {
  Expect
};
