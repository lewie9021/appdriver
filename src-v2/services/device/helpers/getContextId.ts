import { ApiService } from "../../api/ApiService";
import { SessionStore } from "../../../stores/sesssion/SessionStore";

interface GetContextIdParams {
  api: ApiService;
  session: SessionStore;
}

export type GetContextIdResponse = string;

const getContextId = ({ api, session }: GetContextIdParams): Promise<GetContextIdResponse> => {
  return api.get({
    path: `/session/${session.getSessionId()}/context`
  });
};

export default getContextId;