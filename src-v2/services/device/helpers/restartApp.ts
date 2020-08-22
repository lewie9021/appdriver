import { ApiService } from "../../api/ApiService";
import { SessionStore } from "../../../stores/sesssion/SessionStore";
import closeApp from "./closeApp";
import launchApp from "./launchApp";

interface RestartAppParams {
  api: ApiService;
  session: SessionStore;
  appId?: string;
}

export type RestartAppResponse = void;

const restartApp = ({ api, session, appId = session.getAppId() }: RestartAppParams): Promise<RestartAppResponse> => {
  return closeApp({ api, session, appId })
    .then(() => launchApp({ api, session, appId }));
};

export default restartApp;