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

  async toHaveValue(value) {
    const elementText = await this.value.getValue();

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
}

const expect = (value) => {
  return new Expect(value);
};

module.exports = expect;