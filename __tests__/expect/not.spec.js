const { expect: assert } = require("../../");

it("inverts the expectation", async () => {
  const result = assert(100).not;

  expect(result).toHaveProperty("_invert", true);
});