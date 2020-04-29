const { device } = require("../../../main");

describe("Execute (Android)", () => {
  it("works", async () => {
    const permissions = await device.execute("mobile:getPermissions");
    console.log("permissions", permissions);
  });
});