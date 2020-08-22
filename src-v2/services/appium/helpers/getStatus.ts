import { ApiService } from "../../api/ApiService";

interface GetStatusParams {
  api: ApiService;
}

// TODO: Determine response model.
export type GetStatusResponse = object;

const getStatus = ({ api }: GetStatusParams): Promise<GetStatusResponse> => {
  return api.get({
    path: `/status`
  });
};

export default getStatus;