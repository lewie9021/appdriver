const { NotImplementedError } = require("../../src/errors");
const { expect: assert } = require("../../index");

it("doesn't throw if expectation is met", async () => {
  await expect(assert("Hello World").toMatch(/^Hello/))
    .resolves.toBe(undefined);

  await expect(assert("Hello World").toMatch(/hello world/i))
    .resolves.toBe(undefined);

  await expect(assert("Hello World").toMatch(/.*ello.*/i))
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  await expect(assert("Hello World").toMatch(/^World/))
    .rejects.toThrow(new Error("Expected 'Hello World' to match pattern '/^World/'."));

  await expect(assert("Hello World").toMatch(/HelloWorld/))
    .rejects.toThrow(new Error("Expected 'Hello World' to match pattern '/HelloWorld/'."));
});

it("throws if value to perform assertion on isn't a string", async () => {
  await expect(assert(undefined).toMatch(/test/))
    .rejects.toThrow(NotImplementedError);

  await expect(assert(null).toMatch(/test/))
    .rejects.toThrow(NotImplementedError);

  await expect(assert(true).toMatch(/test/))
    .rejects.toThrow(NotImplementedError);

  await expect(assert(50).toMatch(/test/))
    .rejects.toThrow(NotImplementedError);

  await expect(assert([1, 2, 3]).toMatch(/test/))
    .rejects.toThrow(NotImplementedError);

  await expect(assert({a: 1, b: 2}).toMatch(/test/))
    .rejects.toThrow(NotImplementedError);
});