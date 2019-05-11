const { expect: assert } = require("../../index");

it("doesn't throw if expectation is met", async () => {
  await expect(assert([1, 2, 3, 4]).toHaveLength(4))
    .resolves.toBe(undefined);

  await expect(assert("Hello World!").toHaveLength(12))
    .resolves.toBe(undefined);

  await expect(assert({test: 5, length: 10}).toHaveLength(10))
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  await expect(assert([]).toHaveLength(4))
    .rejects.toThrow(new Error("Expected array to have length '4' but instead got '0'."));

  await expect(assert("").toHaveLength(12))
    .rejects.toThrow(new Error("Expected string to have length '12' but instead got '0'."));

  await expect(assert(30).toHaveLength(12))
    .rejects.toThrow(new Error("Expected number to have length '12' but instead got '0'."));

  await expect(assert(true).toHaveLength(12))
    .rejects.toThrow(new Error("Expected boolean to have length '12' but instead got '0'."));

  await expect(assert(undefined).toHaveLength(12))
    .rejects.toThrow(new Error("Expected undefined to have length '12' but instead got '0'."));

  await expect(assert(null).toHaveLength(12))
    .rejects.toThrow(new Error("Expected null to have length '12' but instead got '0'."));

  await expect(assert(Promise.resolve()).toHaveLength(12))
    .rejects.toThrow(new Error("Expected promise to have length '12' but instead got '0'."));
});