import { CreateSessionResponse } from "../../services/appium/helpers/createSession";

type Capabilities = CreateSessionResponse["capabilities"];

export class SessionStore {
  readonly #sessionId: string;
  readonly #capabilities: Capabilities;

  constructor(sessionId: string, capabilities: Capabilities) {
    this.#sessionId = sessionId;
    this.#capabilities = capabilities;
  }

  getSessionId() {
    return this.#sessionId;
  }

  getCapability<Key extends keyof Capabilities = keyof Capabilities>(key: Key): Capabilities[Key] {
    return this.#capabilities[key];
  }

  getCapabilities() {
    return this.#capabilities;
  }

  getAppId() {
    const { platformName, bundleId, appPackage } = this.#capabilities;

    switch (platformName) {
      case "iOS": return bundleId;
      case "Android": return appPackage;
      default: return null;
    }
  }
}

// const session = new SessionStore("sessionId", {});
// const x = session.getCapability("platformName");
// const c = session.getCapabilities();