import { ApiService } from "../../api/ApiService";
import { DesiredCapabilities, AppiumCapabilities } from "../../interfaces/appium";

interface CreateSessionParams {
  api: ApiService;
  capabilities: DesiredCapabilities;
}

// TODO: Determine response model.
export interface CreateSessionResponse {
  sessionId: string;
  capabilities: AppiumCapabilities;
}

const createSession = ({ api, capabilities }: CreateSessionParams): Promise<CreateSessionResponse> => {
  return api.post({
    path: `/session`,
    payload: { desiredCapabilities: capabilities },
    transform: (data) => ({
      sessionId: data.sessionId,
      capabilities: data.value
    })
  });
};

export default createSession;