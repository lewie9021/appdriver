import { ApiService } from "../../api/ApiService";

interface GetStatusParams {
  apiService: ApiService;
}

// TODO: Determine response model.
export type GetStatusResponse = object;

const getStatus = ({ apiService }: GetStatusParams): Promise<GetStatusResponse> => {
  return apiService.get({
    path: `/status`
  });
};

export default getStatus;