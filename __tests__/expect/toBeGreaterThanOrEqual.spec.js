const { NotImplementedError } = require("../../src/worker/errors");
const { expect: assert } = require("../../main");

it("doesn't throw if expectation is met", async () => {
  await expect(assert(20).toBeGreaterThanOrEqual(0))
    .resolves.toEqual(undefined);

  await expect(assert(0).toBeGreaterThanOrEqual(0))
    .resolves.toEqual(undefined);
});

it("inverses the expectation when used with .not", async () => {
  await expect(assert(5).not.toBeGreaterThanOrEqual(10))
    .resolves.toEqual(undefined);
});

it("throws if expectation is not met", async () => {
  await expect(assert(0).toBeGreaterThanOrEqual(5))
    .rejects.toThrow(new Error("Expected 0 to be greater than or equal to 5."));
});

it("throws if expectation is not met when used with .not", async () => {
  await expect(assert(20).not.toBeGreaterThanOrEqual(10))
    .rejects.toThrow(new Error("Expected 20 not to be greater than or equal to 10."));

  await expect(assert(10).not.toBeGreaterThanOrEqual(10))
    .rejects.toThrow(new Error("Expected 10 not to be greater than or equal to 10."));
});

it("throws if value to perform assertion on isn't supported", async () => {
  await expect(assert(undefined).toBeGreaterThanOrEqual(5))
    .rejects.toThrow(NotImplementedError);

  await expect(assert(null).toBeGreaterThanOrEqual(5))
    .rejects.toThrow(NotImplementedError);

  await expect(assert(true).toBeGreaterThanOrEqual(5))
    .rejects.toThrow(NotImplementedError);

  await expect(assert({}).toBeGreaterThanOrEqual(5))
    .rejects.toThrow(NotImplementedError);

  await expect(assert([]).toBeGreaterThanOrEqual(5))
    .rejects.toThrow(NotImplementedError);

  await expect(assert("0").toBeGreaterThanOrEqual(5))
    .rejects.toThrow(NotImplementedError);
});