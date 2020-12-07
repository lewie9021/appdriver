import { AppiumCapabilities } from "../../services/interfaces/appium";

export class SessionStore {
  readonly #sessionId: string;
  readonly #capabilities: AppiumCapabilities;

  constructor(sessionId: string, capabilities: AppiumCapabilities) {
    this.#sessionId = sessionId;
    this.#capabilities = capabilities;
  }

  getSessionId() {
    return this.#sessionId;
  }

  getCapability(key: keyof AppiumCapabilities) {
    return this.#capabilities[key];
  }

  getCapabilities() {
    return this.#capabilities;
  }

  getAppId() {
    switch (this.#capabilities.platformName) {
      case "iOS": return this.#capabilities.bundleId;
      case "Android": return this.#capabilities.appPackage;
      default: return null;
    }
  }
}

// const session = new SessionStore("sessionId", {});
// const x = session.getCapability("platformName");
// const c = session.getCapabilities();