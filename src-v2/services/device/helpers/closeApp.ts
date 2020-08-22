import { ApiService } from "../../api/ApiService";

interface CloseAppParams {
  apiService: ApiService;
  sessionId: string;
  appId: string;
}

export type CloseAppResponse = void;

const closeApp = ({ apiService, sessionId, appId }: CloseAppParams): Promise<CloseAppResponse> => {
  return apiService.post({
    path: `/session/${sessionId}/appium/device/terminate_app`,
    payload: { appId }
  });
};

export default closeApp;