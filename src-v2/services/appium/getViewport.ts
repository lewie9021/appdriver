import { ApiService } from "../ApiService";

interface GetViewportParams {
  apiService: ApiService;
  sessionId: string;
}

export interface GetViewportResponse {
  width: number;
  height: number;
}

const getViewport = ({ apiService, sessionId }: GetViewportParams): Promise<GetViewportResponse> => {
  return apiService.get({
    path: `/session/${sessionId}/window/rect`
  });
};

export default getViewport;