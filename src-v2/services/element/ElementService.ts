import { ApiService } from "../api/ApiService";
import { AppiumElement } from "../interfaces/appium";
import { GetLocationParams } from "./interfaces/elementService";
import getLocation from "./helpers/getLocation";
import getSize from "./helpers/getSize";

export class ElementService {
  readonly #apiService: ApiService;
  readonly #sessionId: string;
  readonly #element: AppiumElement;

  constructor(apiService: ApiService, sessionId: string, element: AppiumElement) {
    this.#apiService = apiService;
    this.#sessionId = sessionId;
    this.#element = element;
  }

  getLocation({ relative = false }: GetLocationParams = {}) {
    return getLocation({
      apiService: this.#apiService,
      sessionId: this.#sessionId,
      element: this.#element,
      relative
    });
  }

  getSize() {
    return getSize({
      apiService: this.#apiService,
      sessionId: this.#sessionId,
      element: this.#element
    });
  }
}

// const apiService = new ApiService("http://localhost:4723/wd/hub");
// const elementService = new ElementService(apiService, "hello", "world");