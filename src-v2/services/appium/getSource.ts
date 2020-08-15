import { ApiService } from "../ApiService";

interface GetSourceParams {
  apiService: ApiService;
  sessionId: string;
}

export type GetSourceResponse = string;

const getSource = ({ apiService, sessionId }: GetSourceParams): Promise<GetSourceResponse> => {
  return apiService.get({
    path: `/session/${sessionId}/source`
  });
};

export default getSource;