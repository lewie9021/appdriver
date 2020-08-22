import { ApiService } from "../api/ApiService";
import { SessionStore } from "../../stores/sesssion/SessionStore";
import { AppiumElement } from "../interfaces/appium";
import { GetLocationParams } from "./interfaces/elementService";
import getLocation from "./helpers/getLocation";
import getSize from "./helpers/getSize";

export class ElementService {
  readonly #api: ApiService;
  readonly #session: SessionStore;
  readonly #element: AppiumElement;

  constructor(api: ApiService, session: SessionStore, element: AppiumElement) {
    this.#api = api;
    this.#session = session;
    this.#element = element;
  }

  getLocation({ relative = false }: GetLocationParams = {}) {
    return getLocation({
      api: this.#api,
      session: this.#session,
      element: this.#element,
      relative
    });
  }

  getSize() {
    return getSize({
      api: this.#api,
      session: this.#session,
      element: this.#element
    });
  }
}

// const apiService = new ApiService("http://localhost:4723/wd/hub");
// const sessionStore = new SessionStore("sessionId", {});
// const elementService = new ElementService(apiService, sessionStore, {});