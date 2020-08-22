import { ApiService } from "../../api/ApiService";
import { AppiumElement } from "../../interfaces/appium";

interface GetSizeParams {
  apiService: ApiService;
  sessionId: string;
  element: AppiumElement;
}

export interface GetSizeResponse {
  width: number;
  height: number;
}

const getSize = ({ apiService, sessionId, element }: GetSizeParams): Promise<GetSizeResponse> => {
  return apiService.get({
    path: `/session/${sessionId}/element/${element.ELEMENT}/size`
  });
};

export default getSize;