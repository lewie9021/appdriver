import { ApiService } from "../../api/ApiService";

interface LaunchAppParams {
  apiService: ApiService;
  sessionId: string;
  appId: string;
}

export type LaunchAppResponse = void;

const launchApp = ({ apiService, sessionId, appId }: LaunchAppParams): Promise<LaunchAppResponse> => {
  return apiService.post({
    path: `/session/${sessionId}/appium/device/activate_app`,
    payload: { appId }
  });
};

export default launchApp;