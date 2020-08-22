import { ApiService } from "../api/ApiService";
import getStatus from "./helpers/getStatus";
import createSession from "./helpers/createSession";
import {
  CreateSessionParams,
  DeleteSessionParams
} from "./interfaces/appiumService";
import deleteSession from "./helpers/deleteSession";

export class AppiumService {
  readonly #api: ApiService;

  constructor(api: ApiService) {
    this.#api = api;
  }

  status() {
    return getStatus({
      api: this.#api
    });
  }

  createSession({ capabilities }: CreateSessionParams) {
    return createSession({
      api: this.#api,
      capabilities
    });
  }

  deleteSession({ sessionId }: DeleteSessionParams) {
    return deleteSession({
      api: this.#api,
      sessionId
    });
  }
}

// const apiService = new ApiService("http://localhost:4723/wd/hub");
// const appiumService = new AppiumService(apiService);