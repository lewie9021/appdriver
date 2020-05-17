const { expect: assert } = require("../../main");

it("doesn't throw if expectation is met", async () => {
  await expect(assert(20).toBeMoreThanOrEqual(0))
    .resolves.toEqual(undefined);

  await expect(assert(0).toBeMoreThanOrEqual(0))
    .resolves.toEqual(undefined);
});

it("inverses the expectation when used with .not", async () => {
  await expect(assert(5).not.toBeMoreThanOrEqual(10))
    .resolves.toEqual(undefined);
});

it("throws if expectation is not met", async () => {
  await expect(assert(0).toBeMoreThanOrEqual(5))
    .rejects.toThrow(new Error("Expected 0 to be more than or equal to 5."));
});

it("throws if expectation is not met when used with .not", async () => {
  await expect(assert(20).not.toBeMoreThanOrEqual(10))
    .rejects.toThrow(new Error("Expected 20 not to be more than or equal to 10."));

  await expect(assert(10).not.toBeMoreThanOrEqual(10))
    .rejects.toThrow(new Error("Expected 10 not to be more than or equal to 10."));
});

it("throws if value to perform assertion on isn't supported", async () => {
  await expect(assert(undefined).toBeMoreThanOrEqual(5))
    .rejects.toThrow(TypeError);

  await expect(assert(null).toBeMoreThanOrEqual(5))
    .rejects.toThrow(TypeError);

  await expect(assert(true).toBeMoreThanOrEqual(5))
    .rejects.toThrow(TypeError);

  await expect(assert({}).toBeMoreThanOrEqual(5))
    .rejects.toThrow(TypeError);

  await expect(assert([]).toBeMoreThanOrEqual(5))
    .rejects.toThrow(TypeError);

  await expect(assert("0").toBeMoreThanOrEqual(5))
    .rejects.toThrow(TypeError);
});