import { ApiService } from "../../api/ApiService";
import { SessionStore } from "../../../stores/sesssion/SessionStore";
import { AppiumElement } from "../../interfaces/appium";

interface GetLocationParams {
  api: ApiService;
  session: SessionStore;
  element: AppiumElement;
  relative?: boolean;
}

export interface GetLocationResponse {
  x: number;
  y: number;
}

const getLocation = ({ api, session, element, relative = false }: GetLocationParams): Promise<GetLocationResponse> => {
  return api.get({
    path: `/session/${session.getSessionId()}/element/${element.ELEMENT}/${relative ? "location_in_view" : "location"}`
  });
};

export default getLocation;