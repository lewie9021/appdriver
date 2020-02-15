const { platform, isPlatform, isRegex } = require("../utils");
const { NotImplementedError, NotSupportedError } = require("./errors");
const Matcher = require("./Matcher");
const getNativeRegex = require("./helpers/getNativeRegex");

const createIdMatcher = (id) => {
  return new Matcher({
    type: "id",
    value: id,
    resolve: () => {
      if (isPlatform("Web")) {
        throw new NotImplementedError();
      }

      if (isRegex(id)) {
        const regex = getNativeRegex(id);

        return platform.select({
          ios: () => ({
            using: "-ios predicate string",
            value: `name MATCHES${regex.modifiers} '${regex.pattern}'`
          }),
          android: () => ({
            using: "-android uiautomator",
            value: `new UiSelector().resourceIdMatches("${regex.modifiers}${regex.pattern}")`
          })
        });
      }

      return {
        using: "id",
        value: id
      };
    }
  });
};

const createLabelMatcher = (label) => {
  return new Matcher({
    type: "label",
    value: label,
    resolve: () => {
      if (isPlatform("Web")) {
        throw new NotImplementedError();
      }

      if (isRegex(label)) {
        const regex = getNativeRegex(label);

        return platform.select({
          ios: () => ({
            using: "-ios predicate string",
            value: `name MATCHES${regex.modifiers} '${regex.pattern}'`
          }),
          android: () => ({
            using: "-android uiautomator",
            value: `new UiSelector().descriptionMatches("${regex.modifiers}${regex.pattern}")`
          })
        });
      }

      return {
        using: "accessibility id",
        value: label
      };
    }
  });
};

const createTextMatcher = (text) => {
  return new Matcher({
    type: "text",
    value: text,
    resolve: () => {
      if (isPlatform("Web")) {
        throw new NotImplementedError();
      }

      if (isRegex(text)) {
        const regex = getNativeRegex(text);

        return platform.select({
          ios: () => ({
            using: "-ios predicate string",
            value: `label MATCHES${regex.modifiers} '${regex.pattern}'`
          }),
          android: () => ({
            using: "-android uiautomator",
            value: `new UiSelector().textMatches("${regex.modifiers}${regex.pattern}")`
          })
        });
      }

      return platform.select({
        ios: () => ({
          using: "-ios predicate string",
          value: `label = '${text}'`
        }),
        android: () => ({
          using: "-android uiautomator",
          value: `new UiSelector().text("${text}")`
        })
      });
    }
  });
};

// TODO: Investigate Web context support.
const createTypeMatcher = (type) => {
  return new Matcher({
    type: "type",
    value: type,
    resolve: () => ({
      using: "class name",
      value: type
    })
  });
};

const createIosPredicateMatcher = (predicate) => {
  return new Matcher({
    type: "ios predicate",
    value: predicate,
    resolve: () => {
      if (isPlatform("iOS")) {
        return {
          using: "-ios predicate string",
          value: predicate
        };
      }

      throw new NotSupportedError();
    }
  });
};

const createUiAutomatorMatcher = (selector) => {
  return new Matcher({
    type: "ui automator",
    value: selector,
    resolve: () => {
      if (isPlatform("Android")) {
        return {
          using: "-android uiautomator",
          value: selector
        };
      }

      throw new NotSupportedError();
    }
  });
};

const createCssMatcher = (css) => {
  return new Matcher({
    type: "css",
    value: css,
    resolve: () => {
      if (isPlatform("Web")) {
        return {
          using: "css selector",
          value: css
        };
      }

      throw new NotImplementedError();
    }
  });
};

module.exports = {
  id: createIdMatcher,
  label: createLabelMatcher,
  text: createTextMatcher,
  type: createTypeMatcher,
  iosPredicate: createIosPredicateMatcher,
  uiAutomator: createUiAutomatorMatcher,
  css: createCssMatcher
};