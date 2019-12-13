const { platform } = require("../../utils");

// Converts JS regex to 'native' (iOS predicate & UiSelector) regex.
const getNativeRegex = (regex) => {
  const pattern = regex.toString();
  const flags = regex.flags.split("");

  return {
    pattern: pattern.slice(1, pattern.lastIndexOf("/")),
    modifiers: platform.select({
      ios: () => flags.includes("i")  ? "[c]" : "",
      android: () => flags.includes("i") ? "(?i)" : ""
    })
  }
};

module.exports = getNativeRegex;