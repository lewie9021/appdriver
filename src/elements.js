const { Element } = require("./element");

const elements = async (matcher) => {
  const response = await matcher.resolve(true);

  return response.value.map((element) => {
    const value = {
      status: response.status,
      value: element,
      sessionId: response.sessionId
    };

    return new Element(Promise.resolve(value));
  });
};

module.exports = elements;