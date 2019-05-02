const commands = require("./commands");

// Very crude implementation that supports simple fuzzy matching, e.g. "list-item-*", "*item*", and "*-item"
// TODO: Needs to escape value to avoid unexpected behaviour.
// TODO: Needs Android support for "*-item" type of queries.
const getLabelQuery = (accessibilityLabel) => {
  if (accessibilityLabel.startsWith("*") && accessibilityLabel.endsWith("*")) {
    const query = accessibilityLabel.substr(1, accessibilityLabel.length - 1);

    switch (global.session.platformName) {
      case "iOS":
        return {
          using: "-ios predicate string",
          value: `name CONTAINS '${query}'`
        };
      case "Android":
        return {
          using: "-android uiautomator",
          value: `new UiSelector().descriptionContains("${query}")`
        };
      default:
        throw new Error(`Label '${accessibilityLabel}' is not supported.`);
    }
  }

  if (accessibilityLabel.endsWith("*")) {
    const query = accessibilityLabel.substr(0, accessibilityLabel.length - 1);

    switch (global.session.platformName) {
      case "iOS":
        return {
          using: "-ios predicate string",
          value: `name BEGINSWITH '${query}'`
        };
      case "Android":
        return {
          using: "-android uiautomator",
          value: `new UiSelector().descriptionStartsWith("${query}")`
        };
      default:
        throw new Error(`Label '${accessibilityLabel}' is not supported.`);
    }
  }

  if (accessibilityLabel.startsWith("*")) {
    const query = accessibilityLabel.substr(1);

    switch (global.session.platformName) {
      case "iOS":
        return {
          using: "-ios predicate string",
          value: `name ENDSWITH '${query}'`
        };
      default:
        throw new Error(`Label '${accessibilityLabel}' is not supported.`);
    }
  }

  return {
    using: "accessibility id",
    value: accessibilityLabel
  }
};

const by = {
  id: (id) => ({
    type: "id",
    value: id,
    resolve: () => {
      return commands.element.findElement({
        using: "id",
        value: id
      })
    }
  }),
  label: (accessibilityLabel) => ({
    type: "accessibility id",
    value: accessibilityLabel,
    resolve: (multiple) => {
      const command = multiple
        ? commands.element.findElements
        : commands.element.findElement;

      return command(getLabelQuery(accessibilityLabel))
    }
  })
};

module.exports = {
  by
};