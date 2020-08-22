import { ApiService } from "../../api/ApiService";
import { SessionStore } from "../../../stores/sesssion/SessionStore";

interface GetSourceParams {
  api: ApiService;
  session: SessionStore;
}

export type GetSourceResponse = string;

const getSource = ({ api, session }: GetSourceParams): Promise<GetSourceResponse> => {
  return api.get({
    path: `/session/${session.getSessionId()}/source`
  });
};

export default getSource;