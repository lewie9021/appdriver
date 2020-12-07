import { AppiumContext } from "../../interfaces/appium";
import { ApiService } from "../../api/ApiService";
import { SessionStore } from "../../../stores/sesssion/SessionStore";

interface GetContextsParams {
  api: ApiService;
  session: SessionStore;
}

export type GetContextsResponse<Context extends AppiumContext | string> = Array<Context>;

const getContexts = <Context extends AppiumContext | string>({ api, session }: GetContextsParams): Promise<GetContextsResponse<Context>> => {
  return api.get({
    path: `/session/${session.getSessionId()}/contexts`
  });
};

export default getContexts;