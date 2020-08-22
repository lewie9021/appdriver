import { ApiService } from "../../api/ApiService";
import { SessionStore } from "../../../stores/sesssion/SessionStore";

interface ResetAppParams {
  api: ApiService;
  session: SessionStore;
}

export type ResetAppResponse = void;

const resetApp = ({ api, session }: ResetAppParams): Promise<ResetAppResponse> => {
  if (session.getCapability("noReset")) {
    return Promise.reject(new Error("Unable to reset app when capabilities.noReset is enabled."));
  }

  return api.post({
    path: `/session/${session.getSessionId()}/appium/app/reset`
  });
};

export default resetApp;