const { expect: assert } = require("../../main");

it("inverts the expectation", async () => {
  const result = assert(100).not;

  expect(result).toHaveProperty("_invert", true);
});