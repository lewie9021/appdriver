const { NotImplementedError } = require("../../src/worker/errors");
const { expect: assert } = require("../../index");

it("doesn't throw if expectation is met", async () => {
  await expect(assert(20).toBeGreaterThan(0))
    .resolves.toEqual(undefined);
});

it("inverses the expectation when used with .not", async () => {
  await expect(assert(5).not.toBeGreaterThan(10))
    .resolves.toEqual(undefined);
});

it("throws if expectation is not met", async () => {
  await expect(assert(0).toBeGreaterThan(5))
  .rejects.toThrow(new Error("Expected 0 to be greater than 5."));
});

it("throws if expectation is not met when used with .not", async () => {
  await expect(assert(20).not.toBeGreaterThan(10))
    .rejects.toThrow(new Error("Expected 20 not to be greater than 10."));
});

it("throws if value to perform assertion on isn't supported", async () => {
  await expect(assert(undefined).toBeGreaterThan(5))
    .rejects.toThrow(NotImplementedError);

  await expect(assert(null).toBeGreaterThan(5))
    .rejects.toThrow(NotImplementedError);

  await expect(assert(true).toBeGreaterThan(5))
    .rejects.toThrow(NotImplementedError);

  await expect(assert({}).toBeGreaterThan(5))
    .rejects.toThrow(NotImplementedError);

  await expect(assert([]).toBeGreaterThan(5))
    .rejects.toThrow(NotImplementedError);

  await expect(assert("0").toBeGreaterThan(5))
    .rejects.toThrow(NotImplementedError);
});