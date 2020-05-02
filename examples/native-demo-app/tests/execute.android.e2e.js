const { device, expect } = require("../../../main");

describe("Execute (Android)", () => {
  it("works", async () => {
    const deviceInfo = await device.execute("mobile:deviceInfo");

    expect(deviceInfo.carrierName).toEqual("Android");
    expect(deviceInfo.apiVersion).toEqual("27");
  });
});