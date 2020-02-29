jest.mock("node-fetch");
jest.mock("../src/stores/configStore");
jest.mock("../src/worker/services/commandLineService");

const fetch = require("node-fetch").default;
const { Response } = jest.requireActual("node-fetch");

const { configStore } = require("../src/stores/configStore");
const { AppiumError } = require("../src/worker/errors");
const { request } = require("../src/worker/services/request");

const BASE_URL = "http://localhost:4723/wd/hub";

beforeEach(() => {
  jest.spyOn(configStore, "getBaseUrl").mockReturnValue(BASE_URL);
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const methods = [
  { type: "GET", features: { payload: false } },
  { type: "POST", features: { payload: true } },
  { type: "PATCH", features: { payload: true } },
  { type: "PUT", features: { payload: true } },
  { type: "DELETE", features: { payload: true } }
];

methods.forEach((method) => {
  describe(`${method.type} Requests`, () => {
    it("parses the json response and returns its value property", async () => {
      const rawJsonResponse = `{ "value": { "test": 1 } }`;
      const params = { method: method.type, path: "/test" };

      fetch.mockReturnValue(Promise.resolve(new Response(rawJsonResponse)));

      const result = await request(params);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(JSON.parse(rawJsonResponse).value);
    });

    it("supports transforming the entire json response", async () => {
      const rawJsonResponse = `{ "value": { "test": 5 } }`;
      const transform = (x) => x.value.test * 2;
      const params = { method: method.type, path: "/test", transform };

      fetch.mockReturnValue(Promise.resolve(new Response(rawJsonResponse)));

      const result = await request(params);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(transform(JSON.parse(rawJsonResponse)));
    });

    it("throws an Appium error if a non-zero status is returned", async () => {
      const rawJsonResponse = `{ "status": 7, "value": { "message": "Failed to find element." } }`;
      const transform = (x) => x.value.test * 2;
      const params = { method: method.type, path: "/test", transform };

      fetch.mockReturnValue(Promise.resolve(new Response(rawJsonResponse)));
      expect.assertions(3);

      try {
        await request(params);
      } catch (err) {
        expect(err).toBeInstanceOf(AppiumError);
        expect(err).toHaveProperty("message", JSON.parse(rawJsonResponse).value.message);
      }

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("supports passing a path parameter", async () => {
      const rawJsonResponse = "{}";
      const params = { method: method.type, path: "/test" };

      fetch.mockReturnValue(Promise.resolve(new Response(rawJsonResponse)));

      await request(params);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}${params.path}`, {
          method: params.method
        }
      );
    });

    it("supports passing a query parameter", async () => {
      const rawJsonResponse = "{}";
      const params = { method: method.type, path: "/test", query: { param1: "value1", param2: "value2" } };

      fetch.mockReturnValue(Promise.resolve(new Response(rawJsonResponse)));

      await request(params);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}${params.path}?param1=value1&param2=value2`, {
          method: params.method
        }
      );
    });

    if (method.features.payload) {
      it("supports passing a payload parameter", async () => {
        const rawJsonResponse = "{}";
        const params = { method: method.type, path: "/test", payload: { test: "value" } };

        fetch.mockReturnValue(Promise.resolve(new Response(rawJsonResponse)));

        await request(params);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
          `${BASE_URL}${params.path}`, {
            method: params.method,
            body: JSON.stringify(params.payload),
            headers: { "Content-Type": "application/json" }
          }
        );
      });
    }
  });
});
