import { ApiService } from "./ApiService";
import getViewport from "./appium/getViewport";
import getSource from "./appium/getSource";

export class DeviceService {
  readonly #apiService: ApiService;
  readonly #sessionId: string;

  constructor(apiService: ApiService, sessionId: string) {
    this.#apiService = apiService;
    this.#sessionId = sessionId;
  }

  getViewport() {
    return getViewport({
      apiService: this.#apiService,
      sessionId: this.#sessionId
    });
  }

  getSource() {
    return getSource({
      apiService: this.#apiService,
      sessionId: this.#sessionId
    });
  }
}

// const apiService = new ApiService("http://localhost:4723/wd/hub");
// const deviceService = new DeviceService(apiService, "hello");