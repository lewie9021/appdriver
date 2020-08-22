import { ApiService } from "../../api/ApiService";
import { SessionStore } from "../../../stores/sesssion/SessionStore";
import { AppiumElement } from "../../interfaces/appium";

interface GetSizeParams {
  api: ApiService;
  session: SessionStore;
  element: AppiumElement;
}

export interface GetSizeResponse {
  width: number;
  height: number;
}

const getSize = ({ api, session, element }: GetSizeParams): Promise<GetSizeResponse> => {
  return api.get({
    path: `/session/${session.getSessionId()}/element/${element.ELEMENT}/size`
  });
};

export default getSize;