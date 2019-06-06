const { Element } = require("./element");

const elements = async (matcher) => {
  const response = await matcher.resolve(true);

  return response.map((elementId) => {
    // TODO: Crude implementation to maintain consistency.
    // Could probably use element.exist check before returning value?.
    const elementMatcher = {
      type: "element id",
      value: elementId,
      resolve: () => Promise.resolve(elementId)
    };

    return new Element({matcher: elementMatcher, value: Promise.resolve(elementId)});
  });
};

module.exports = elements;