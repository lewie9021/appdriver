const { expect: assert } = require("../../main");

it("doesn't throw if expectation is met", async () => {
  await expect(assert(0).toBeLessThan(5))
    .resolves.toEqual(undefined);
});

it("inverses the expectation when used with .not", async () => {
  await expect(assert(10).not.toBeLessThan(5))
    .resolves.toEqual(undefined);
});

it("throws if expectation is not met", async () => {
  await expect(assert(10).toBeLessThan(5))
    .rejects.toThrow(new Error("Expected 10 to be less than 5."));
});

it("throws if expectation is not met when used with .not", async () => {
  await expect(assert(0).not.toBeLessThan(10))
    .rejects.toThrow(new Error("Expected 0 not to be less than 10."));
});

it("throws if value to perform assertion on isn't supported", async () => {
  await expect(assert(undefined).toBeLessThan(5))
    .rejects.toThrow(TypeError);

  await expect(assert(null).toBeLessThan(5))
    .rejects.toThrow(TypeError);

  await expect(assert(true).toBeLessThan(5))
    .rejects.toThrow(TypeError);

  await expect(assert({}).toBeLessThan(5))
    .rejects.toThrow(TypeError);

  await expect(assert([]).toBeLessThan(5))
    .rejects.toThrow(TypeError);

  await expect(assert("0").toBeLessThan(5))
    .rejects.toThrow(TypeError);
});