import { ApiService } from "../../api/ApiService";
import { SessionStore } from "../../../stores/sesssion/SessionStore";
import { AppiumElement } from "../../interfaces/appium";

interface GetActiveElementParams {
  api: ApiService;
  session: SessionStore;
}

export type GetActiveElementResponse = AppiumElement | null;

// Note: Only supported on iOS.
const getActiveElement = ({ api, session }: GetActiveElementParams): Promise<GetActiveElementResponse> => {
  return api.post({
    path: `/session/${session.getSessionId()}/element/active`
  })
    .catch((err) => {
      // Handle case when no active element is found.
      if (err.status === 7) {
        return null;
      }

      throw err;
    });
};

export default getActiveElement;