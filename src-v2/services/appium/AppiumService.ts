import { ApiService } from "../api/ApiService";
import getStatus from "./helpers/getStatus";
import createSession from "./helpers/createSession";
import {
  CreateSessionParams,
  DeleteSessionParams
} from "./interfaces/appiumService";
import deleteSession from "./helpers/deleteSession";

export class AppiumService {
  readonly #apiService: ApiService;

  constructor(apiService: ApiService) {
    this.#apiService = apiService;
  }

  status() {
    return getStatus({
      apiService: this.#apiService
    });
  }

  createSession({ capabilities }: CreateSessionParams) {
    return createSession({
      apiService: this.#apiService,
      capabilities
    });
  }

  deleteSession({ sessionId }: DeleteSessionParams) {
    return deleteSession({
      apiService: this.#apiService,
      sessionId
    });
  }
}

// const apiService = new ApiService("http://localhost:4723/wd/hub");
// const appiumService = new AppiumService(apiService);