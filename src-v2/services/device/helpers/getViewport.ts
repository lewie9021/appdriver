import { ApiService } from "../../api/ApiService";
import { SessionStore } from "../../../stores/sesssion/SessionStore";

interface GetViewportParams {
  api: ApiService;
  session: SessionStore;
}

export interface GetViewportResponse {
  width: number;
  height: number;
}

const getViewport = ({ api, session }: GetViewportParams): Promise<GetViewportResponse> => {
  return api.get({
    path: `/session/${session.getSessionId()}/window/rect`
  });
};

export default getViewport;