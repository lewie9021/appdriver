const { platform } = require("../../utils");

// Converts JS regex to 'native' (iOS predicate & UiSelector) regex.
const getNativeRegex = (regex) => {
  const pattern = regex.toString();
  const flags = regex.flags.split("");

  return platform.select({
    ios: () => ({
      pattern: pattern
        .slice(1, pattern.lastIndexOf("/"))
        .replace(/\\/g, "\\\\"),
      modifiers: flags.includes("i")  ? "[c]" : ""
    }),
    android: () => ({
      pattern: pattern.slice(1, pattern.lastIndexOf("/")),
      modifiers: flags.includes("i") ? "(?i)" : ""
    })
  });
};

module.exports = getNativeRegex;