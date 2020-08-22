import { ApiService } from "../../api/ApiService";
import { AppiumCapabilities } from "../../interfaces/appium";

interface CreateSessionParams {
  apiService: ApiService;
  capabilities: AppiumCapabilities;
}

// TODO: Determine response model.
export interface CreateSessionResponse {
  sessionId: string;
  capabilities: object;
}

const createSession = ({ apiService, capabilities }: CreateSessionParams): Promise<CreateSessionResponse> => {
  return apiService.post({
    path: `/session`,
    payload: { desiredCapabilities: capabilities },
    transform: (data) => ({
      sessionId: data.sessionId,
      capabilities: data.value
    })
  });
};

export default createSession;