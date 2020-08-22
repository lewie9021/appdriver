import { ApiService } from "../../api/ApiService";
import { SessionStore } from "../../../stores/sesssion/SessionStore";

interface LaunchAppParams {
  api: ApiService;
  session: SessionStore;
  appId: string;
}

export type LaunchAppResponse = void;

const launchApp = ({ api, session, appId }: LaunchAppParams): Promise<LaunchAppResponse> => {
  return api.post({
    path: `/session/${session.getSessionId()}/appium/device/activate_app`,
    payload: { appId }
  });
};

export default launchApp;