import { ApiService } from "../api/ApiService";
import { CloseAppParams, LaunchAppParams } from "./interfaces/deviceService";
import launchApp from "./helpers/launchApp";
import closeApp from "./helpers/closeApp";
import getSource from "./helpers/getSource";
import getViewport from "./helpers/getViewport";

export class DeviceService {
  readonly #apiService: ApiService;
  readonly #sessionId: string;

  constructor(apiService: ApiService, sessionId: string) {
    this.#apiService = apiService;
    this.#sessionId = sessionId;
  }

  launchApp({ appId }: LaunchAppParams) {
    return launchApp({
      apiService: this.#apiService,
      sessionId: this.#sessionId,
      appId
    });
  }

  closeApp({ appId }: CloseAppParams) {
    return closeApp({
      apiService: this.#apiService,
      sessionId: this.#sessionId,
      appId
    });
  }

  getSource() {
    return getSource({
      apiService: this.#apiService,
      sessionId: this.#sessionId
    });
  }

  getViewport() {
    return getViewport({
      apiService: this.#apiService,
      sessionId: this.#sessionId
    });
  }
}

// const apiService = new ApiService("http://localhost:4723/wd/hub");
// const deviceService = new DeviceService(apiService, "hello");