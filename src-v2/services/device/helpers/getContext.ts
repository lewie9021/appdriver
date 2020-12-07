import {
  AppiumCapabilities,
  AppiumContext,
  AppiumIOSCapabilities
} from "../../interfaces/appium";
import { ApiService } from "../../api/ApiService";
import { SessionStore } from "../../../stores/sesssion/SessionStore";
import getContextId from "./getContextId";
import getContexts from "./getContexts";

interface GetContextParams {
  api: ApiService;
  session: SessionStore;
}

export type GetContextResponse = AppiumContext;

const getContext = async ({ api, session }: GetContextParams): Promise<GetContextResponse> => {
  const platformName = session.getCapability("platformName");
  const fullContextList = session.getCapability("fullContextList");

  if (platformName === "iOS" && fullContextList) {
    const [ contexts, contextId ] = await Promise.all([
      getContexts<AppiumContext>({ api, session }),
      getContextId({ api, session })
    ]);

    const context = contexts.find((x) => x.id === contextId);

    if (!context) {
      return {
        id: contextId,
        title: null,
        url: null
      };
    }

    return context;
  }

  const contextId = await getContextId({ api, session });

  return {
    id: contextId,
    title: null,
    url: null
  };
};

export default getContext;