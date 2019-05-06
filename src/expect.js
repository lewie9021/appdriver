class Expect {
  constructor(value) {
    this.value = value;
  }

  async toHaveText(value) {
    const elementText = await this.value.getText();

    if (elementText !== value) {
      throw new Error(`Expected element to have value '${value}' but instead got '${elementText}'.`);
    }
  }
}

const expect = (value) => {
  return new Expect(value);
};

module.exports = expect;