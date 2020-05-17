const { expect: assert } = require("../../main");

it("doesn't throw if expectation is met", async () => {
  await expect(assert(20).toBeMoreThan(0))
    .resolves.toEqual(undefined);
});

it("inverses the expectation when used with .not", async () => {
  await expect(assert(5).not.toBeMoreThan(10))
    .resolves.toEqual(undefined);
});

it("throws if expectation is not met", async () => {
  await expect(assert(0).toBeMoreThan(5))
    .rejects.toThrow(new Error("Expected 0 to be more than 5."));
});

it("throws if expectation is not met when used with .not", async () => {
  await expect(assert(20).not.toBeMoreThan(10))
    .rejects.toThrow(new Error("Expected 20 not to be more than 10."));
});

it("throws if value to perform assertion on isn't supported", async () => {
  await expect(assert(undefined).toBeMoreThan(5))
    .rejects.toThrow(TypeError);

  await expect(assert(null).toBeMoreThan(5))
    .rejects.toThrow(TypeError);

  await expect(assert(true).toBeMoreThan(5))
    .rejects.toThrow(TypeError);

  await expect(assert({}).toBeMoreThan(5))
    .rejects.toThrow(TypeError);

  await expect(assert([]).toBeMoreThan(5))
    .rejects.toThrow(TypeError);

  await expect(assert("0").toBeMoreThan(5))
    .rejects.toThrow(TypeError);
});