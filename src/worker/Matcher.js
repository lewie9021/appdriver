class Matcher {
  constructor({ type, value, resolve }) {
    this.type = type;
    this.value = value;
    this.resolve = resolve;
  }
}

module.exports = Matcher;