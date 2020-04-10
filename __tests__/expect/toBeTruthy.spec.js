const { expect: assert } = require("../../main");

it("doesn't throw if expectation is met", async () => {
  await expect(assert("Hello World!").toBeTruthy())
    .resolves.toBe(undefined);

  await expect(assert(10).toBeTruthy())
    .resolves.toBe(undefined);

  await expect(assert(true).toBeTruthy())
    .resolves.toBe(undefined);

  await expect(assert([]).toBeTruthy())
    .resolves.toBe(undefined);

  await expect(assert({}).toBeTruthy())
    .resolves.toBe(undefined);
});

it("inverses the expectation when used with .not", async () => {
  await expect(assert(undefined).not.toBeTruthy())
    .resolves.toBe(undefined);

  await expect(assert(null).not.toBeTruthy())
    .resolves.toBe(undefined);

  await expect(assert(0).not.toBeTruthy())
    .resolves.toBe(undefined);

  await expect(assert("").not.toBeTruthy())
    .resolves.toBe(undefined);

  await expect(assert(NaN).not.toBeTruthy())
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  await expect(assert(undefined).toBeTruthy())
    .rejects.toThrow(new Error("Expected undefined to be truthy."));

  await expect(assert(null).toBeTruthy())
    .rejects.toThrow(new Error("Expected null to be truthy."));

  await expect(assert(0).toBeTruthy())
    .rejects.toThrow(new Error("Expected 0 to be truthy."));

  await expect(assert("").toBeTruthy())
    .rejects.toThrow(new Error("Expected '' to be truthy."));

  await expect(assert(NaN).toBeTruthy())
    .rejects.toThrow(new Error("Expected NaN to be truthy."));
});

it("throws if expectation is not met when used with .not", async () => {
  await expect(assert("Hello World!").not.toBeTruthy())
    .rejects.toThrow(new Error("Expected 'Hello World!' not to be truthy."));

  await expect(assert(10).not.toBeTruthy())
    .rejects.toThrow(new Error("Expected 10 not to be truthy."));

  await expect(assert(true).not.toBeTruthy())
    .rejects.toThrow(new Error("Expected true not to be truthy."));

  await expect(assert([]).not.toBeTruthy())
    .rejects.toThrow(new Error("Expected [] not to be truthy."));

  await expect(assert({}).not.toBeTruthy())
    .rejects.toThrow(new Error("Expected object not to be truthy."));
});