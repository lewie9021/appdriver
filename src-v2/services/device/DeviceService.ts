import { ApiService } from "../api/ApiService";
import { SessionStore } from "../../stores/sesssion/SessionStore";
import { CloseAppParams, LaunchAppParams } from "./interfaces/deviceService";
import launchApp from "./helpers/launchApp";
import closeApp from "./helpers/closeApp";
import getSource from "./helpers/getSource";
import getViewport from "./helpers/getViewport";

export class DeviceService {
  readonly #api: ApiService;
  readonly #session: SessionStore;

  constructor(api: ApiService, session: SessionStore) {
    this.#api = api;
    this.#session = session;
  }

  launchApp({ appId }: LaunchAppParams) {
    return launchApp({
      api: this.#api,
      session: this.#session,
      appId
    });
  }

  closeApp({ appId }: CloseAppParams) {
    return closeApp({
      api: this.#api,
      session: this.#session,
      appId
    });
  }

  getSource() {
    return getSource({
      api: this.#api,
      session: this.#session,
    });
  }

  getViewport() {
    return getViewport({
      api: this.#api,
      session: this.#session,
    });
  }
}

// const api = new ApiService("http://localhost:4723/wd/hub");
// const session = new SessionStore("sessionId", {});
// const deviceService = new DeviceService(api, session);