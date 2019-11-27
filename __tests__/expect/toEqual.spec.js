const { NotImplementedError } = require("../../src/worker/errors");
const { expect: assert } = require("../../index");

it("doesn't throw if expectation is met", async () => {
  await expect(assert(5).toEqual(5))
    .resolves.toBe(undefined);

  await expect(assert("Hello World!").toEqual("Hello World!"))
    .resolves.toBe(undefined);

  await expect(assert(true).toEqual(true))
    .resolves.toBe(undefined);

  await expect(assert(false).toEqual(false))
    .resolves.toBe(undefined);

  await expect(assert(null).toEqual(null))
    .resolves.toBe(undefined);

  await expect(assert(undefined).toEqual(undefined))
    .resolves.toBe(undefined);

  await expect(assert(Promise.resolve(10)).toEqual(10))
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  await expect(assert(10).toEqual(2))
    .rejects.toThrow(new Error("Expected number to equal 2 but instead got 10."));

  await expect(assert("Hello").toEqual("World"))
    .rejects.toThrow(new Error("Expected string to equal 'World' but instead got 'Hello'."));

  await expect(assert(true).toEqual(false))
    .rejects.toThrow(new Error("Expected boolean to equal false but instead got true."));

  await expect(assert(Promise.resolve(20)).toEqual(100))
    .rejects.toThrow(new Error("Expected promise to equal 100 but instead got 20."));
});

it("throws if expectation is not supported", async () => {
  await expect(assert([1, 2, 3]).toEqual([1, 2, 3]))
    .rejects.toThrow(NotImplementedError);

  await expect(assert({a: 1, b: 2}).toEqual({a: 1, b: 2}))
    .rejects.toThrow(NotImplementedError);

  await expect(assert(Promise.resolve([1, 2, 3])).toEqual([1, 2, 3]))
    .rejects.toThrow(NotImplementedError);

  await expect(assert(Promise.resolve({a: 1, b: 2})).toEqual({a: 1, b: 2}))
    .rejects.toThrow(NotImplementedError);
});