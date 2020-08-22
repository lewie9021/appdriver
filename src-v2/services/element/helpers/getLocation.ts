import { ApiService } from "../../api/ApiService";
import { AppiumElement } from "../../interfaces/appium";

interface GetLocationParams {
  apiService: ApiService;
  sessionId: string;
  element: AppiumElement;
  relative?: boolean;
}

export interface GetLocationResponse {
  x: number;
  y: number;
}

const getLocation = ({ apiService, sessionId, element, relative = false }: GetLocationParams): Promise<GetLocationResponse> => {
  return apiService.get({
    path: `/session/${sessionId}/element/${element.ELEMENT}/${relative ? "location_in_view" : "location"}`
  });
};

export default getLocation;