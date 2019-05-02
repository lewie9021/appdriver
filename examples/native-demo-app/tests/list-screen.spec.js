const { by, element, elements, commands } = require("../../../index");

describe("List Screen", () => {
  const screenTestId = "list-screen";

  it("works", async () => {
    console.log("[1] Waiting for screen to load...");
    await element(by.label(screenTestId)).waitToExist(by.label(screenTestId));

    const response = await elements(by.label("list-item-*"));

    console.log(JSON.stringify(response.value, null, 2));
  });
});