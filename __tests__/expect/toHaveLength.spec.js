const { NotImplementedError } = require("../../src/worker/errors");
const { expect: assert } = require("../../main");

it("doesn't throw if expectation is met", async () => {
  await expect(assert([ 1, 2, 3, 4 ]).toHaveLength(4))
    .resolves.toBe(undefined);

  await expect(assert("Hello World!").toHaveLength(12))
    .resolves.toBe(undefined);

  await expect(assert({ test: 5, length: 10 }).toHaveLength(10))
    .resolves.toBe(undefined);

  await expect(assert({}).toHaveLength(0))
    .resolves.toBe(undefined);

  await expect(assert(Promise.resolve([ 1, 2, 3 ])).toHaveLength(3))
    .resolves.toBe(undefined);
});

it("inverses the expectation when used with .not", async () => {
  await expect(assert([ 1, 2, 3, 4 ]).not.toHaveLength(0))
    .resolves.toBe(undefined);

  await expect(assert("Hello World!").not.toHaveLength(5))
    .resolves.toBe(undefined);

  await expect(assert({ test: 5, length: 10 }).not.toHaveLength(5))
    .resolves.toBe(undefined);

  await expect(assert({}).not.toHaveLength(10))
    .resolves.toBe(undefined);

  await expect(assert(Promise.resolve([ 1, 2, 3 ])).not.toHaveLength(0))
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  await expect(assert([]).toHaveLength(4))
    .rejects.toThrow(new Error("Expected array to have length '4' but instead got '0'."));

  await expect(assert("").toHaveLength(12))
    .rejects.toThrow(new Error("Expected string to have length '12' but instead got '0'."));

  await expect(assert({}).toHaveLength(12))
    .rejects.toThrow(new Error("Expected object to have length '12' but instead got '0'."));

  await expect(assert(Promise.resolve([ 1, 2, 3, 4 ])).toHaveLength(3))
    .rejects.toThrow(new Error("Expected promise to have length '3' but instead got '4'."));
});

it("throws if expectation is not met when used with .not", async () => {
  await expect(assert([ 1, 2, 3 ]).not.toHaveLength(3))
    .rejects.toThrow(new Error("Expected array not to have length '3'."));

  await expect(assert("Hello").not.toHaveLength(5))
    .rejects.toThrow(new Error("Expected string not to have length '5'."));

  await expect(assert({}).not.toHaveLength(0))
    .rejects.toThrow(new Error("Expected object not to have length '0'."));

  await expect(assert(Promise.resolve([ 1, 2, 3, 4 ])).not.toHaveLength(4))
    .rejects.toThrow(new Error("Expected promise not to have length '4'."));
});

it("throws if value to perform assertion on isn't supported", async () => {
  await expect(assert(undefined).toHaveLength(0))
    .rejects.toThrow(NotImplementedError);

  await expect(assert(null).toHaveLength(0))
    .rejects.toThrow(NotImplementedError);

  await expect(assert(true).toHaveLength(0))
    .rejects.toThrow(NotImplementedError);

  await expect(assert(50).toHaveLength(0))
    .rejects.toThrow(NotImplementedError);
});