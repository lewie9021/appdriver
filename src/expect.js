class Expect {
  constructor(element) {
    this.element = element;
  }

  async toHaveValue(value) {
    const elementText = await this.element.getText();

    if (elementText !== value) {
      throw new Error(`Expected element to have value '${value}' but instead got '${elementText}'`);
    }
  }
}

const expect = (element) => {
  return new Expect(element);
};

module.exports = expect;