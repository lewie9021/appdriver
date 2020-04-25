const { expect: assert } = require("../../main");

it("doesn't throw if expectation is met", async () => {
  await expect(assert(undefined).toBeFalsy())
    .resolves.toBe(undefined);

  await expect(assert(null).toBeFalsy())
    .resolves.toBe(undefined);

  await expect(assert(0).toBeFalsy())
    .resolves.toBe(undefined);

  await expect(assert("").toBeFalsy())
    .resolves.toBe(undefined);

  await expect(assert(NaN).toBeFalsy())
    .resolves.toBe(undefined);

  await expect(assert(Promise.resolve(false)).toBeFalsy())
    .resolves.toBe(undefined);
});

it("inverses the expectation when used with .not", async () => {
  await expect(assert("Hello World!").not.toBeFalsy())
    .resolves.toBe(undefined);

  await expect(assert(10).not.toBeFalsy())
    .resolves.toBe(undefined);

  await expect(assert(true).not.toBeFalsy())
    .resolves.toBe(undefined);

  await expect(assert([]).not.toBeFalsy())
    .resolves.toBe(undefined);

  await expect(assert({}).not.toBeFalsy())
    .resolves.toBe(undefined);

  await expect(assert(Promise.resolve(true)).not.toBeFalsy())
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  await expect(assert("Hello World!").toBeFalsy())
    .rejects.toThrow(new Error("Expected 'Hello World!' to be falsy."));

  await expect(assert(10).toBeFalsy())
    .rejects.toThrow(new Error("Expected 10 to be falsy."));

  await expect(assert(true).toBeFalsy())
    .rejects.toThrow(new Error("Expected true to be falsy."));

  await expect(assert([]).toBeFalsy())
    .rejects.toThrow(new Error("Expected [] to be falsy."));

  await expect(assert({}).toBeFalsy())
    .rejects.toThrow(new Error("Expected object to be falsy."));

  await expect(assert(Promise.resolve(true)).toBeFalsy())
    .rejects.toThrow(new Error("Expected promise to be falsy."));
});

it("throws if expectation is not met when used with .not", async () => {
  await expect(assert(undefined).not.toBeFalsy())
    .rejects.toThrow(new Error("Expected undefined not to be falsy."));

  await expect(assert(null).not.toBeFalsy())
    .rejects.toThrow(new Error("Expected null not to be falsy."));

  await expect(assert(0).not.toBeFalsy())
    .rejects.toThrow(new Error("Expected 0 not to be falsy."));

  await expect(assert("").not.toBeFalsy())
    .rejects.toThrow(new Error("Expected '' not to be falsy."));

  await expect(assert(NaN).not.toBeFalsy())
    .rejects.toThrow(new Error("Expected NaN not to be falsy."));

  await expect(assert(Promise.resolve(false)).not.toBeFalsy())
    .rejects.toThrow(new Error("Expected promise not to be falsy."));
});