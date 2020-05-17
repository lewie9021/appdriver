const { expect: assert } = require("../../main");

it("doesn't throw if expectation is met", async () => {
  await expect(assert(0).toBeLessThanOrEqual(5))
    .resolves.toEqual(undefined);

  await expect(assert(5).toBeLessThanOrEqual(5))
    .resolves.toEqual(undefined);
});

it("inverses the expectation when used with .not", async () => {
  await expect(assert(10).not.toBeLessThanOrEqual(5))
    .resolves.toEqual(undefined);
});

it("throws if expectation is not met", async () => {
  await expect(assert(10).toBeLessThanOrEqual(5))
    .rejects.toThrow(new Error("Expected 10 to be less than or equal to 5."));
});

it("throws if expectation is not met when used with .not", async () => {
  await expect(assert(0).not.toBeLessThanOrEqual(10))
    .rejects.toThrow(new Error("Expected 0 not to be less than or equal to 10."));

  await expect(assert(10).not.toBeLessThanOrEqual(10))
    .rejects.toThrow(new Error("Expected 10 not to be less than or equal to 10."));
});

it("throws if value to perform assertion on isn't supported", async () => {
  await expect(assert(undefined).toBeLessThanOrEqual(5))
    .rejects.toThrow(TypeError);

  await expect(assert(null).toBeLessThanOrEqual(5))
    .rejects.toThrow(TypeError);

  await expect(assert(true).toBeLessThanOrEqual(5))
    .rejects.toThrow(TypeError);

  await expect(assert({}).toBeLessThanOrEqual(5))
    .rejects.toThrow(TypeError);

  await expect(assert([]).toBeLessThanOrEqual(5))
    .rejects.toThrow(TypeError);

  await expect(assert("0").toBeLessThanOrEqual(5))
    .rejects.toThrow(TypeError);
});