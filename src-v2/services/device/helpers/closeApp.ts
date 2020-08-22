import { ApiService } from "../../api/ApiService";
import { SessionStore } from "../../../stores/sesssion/SessionStore";

interface CloseAppParams {
  api: ApiService;
  session: SessionStore;
  appId: string;
}

export type CloseAppResponse = void;

const closeApp = ({ api, session, appId }: CloseAppParams): Promise<CloseAppResponse> => {
  return api.post({
    path: `/session/${session.getSessionId()}/appium/device/terminate_app`,
    payload: { appId }
  });
};

export default closeApp;