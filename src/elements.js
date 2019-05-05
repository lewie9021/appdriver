const { Element } = require("./element");

const elements = async (matcher) => {
  const response = await matcher.resolve(true);

  return response.value.map((element) => {
    const value = {
      status: response.status,
      value: element,
      sessionId: response.sessionId
    };

    // TODO: Crude implementation to maintain consistency.
    // Could probably use element.exist check before returning value?.
    const elementMatcher = {
      type: "element id",
      value: element.ELEMENT,
      resolve: () => Promise.resolve(element)
    };

    return new Element({matcher: elementMatcher, value: Promise.resolve(value)});
  });
};

module.exports = elements;