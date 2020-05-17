const { expect: assert } = require("../../main");

it("doesn't throw if expectation is met", async () => {
  await expect(assert("Hello World").toMatch(/^Hello/))
    .resolves.toBe(undefined);

  await expect(assert("Hello World").toMatch(/hello world/i))
    .resolves.toBe(undefined);

  await expect(assert("Hello World").toMatch(/.*ello.*/i))
    .resolves.toBe(undefined);
});

it("inverses the expectation when used with .not", async () => {
  await expect(assert("Hello World").not.toMatch(/test/))
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  await expect(assert("Hello World").toMatch(/^World/))
    .rejects.toThrow(new Error("Expected 'Hello World' to match '/^World/'."));

  await expect(assert("Hello World").toMatch(/HelloWorld/))
    .rejects.toThrow(new Error("Expected 'Hello World' to match '/HelloWorld/'."));
});

it("throws if expectation is not met when used with .not", async () => {
  await expect(assert("Hello World").not.toMatch(/^Hello World$/i))
    .rejects.toThrow(new Error("Expected 'Hello World' not to match '/^Hello World$/i'."));
});

it("throws if value to perform assertion on isn't a string", async () => {
  await expect(assert(undefined).toMatch(/test/))
    .rejects.toThrow(TypeError);

  await expect(assert(null).toMatch(/test/))
    .rejects.toThrow(TypeError);

  await expect(assert(true).toMatch(/test/))
    .rejects.toThrow(TypeError);

  await expect(assert(50).toMatch(/test/))
    .rejects.toThrow(TypeError);

  await expect(assert([ 1, 2, 3 ]).toMatch(/test/))
    .rejects.toThrow(TypeError);

  await expect(assert({ a: 1, b: 2 }).toMatch(/test/))
    .rejects.toThrow(TypeError);
});