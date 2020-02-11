class Matcher {
  constructor({ type, value, resolve }) {
    this.type = type;
    this.value = value;
    this.resolve = resolve;
  }

  getLocator() {
    try {
      return this.resolve();
    } catch(e) {
      return null;
    }
  }
}

module.exports = Matcher;