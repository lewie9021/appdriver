import { ApiService } from "../../api/ApiService";

interface DeleteSessionParams {
  apiService: ApiService;
  sessionId: string;
}

export type DeleteSessionResponse = null;

const deleteSession = ({ apiService, sessionId }: DeleteSessionParams): Promise<DeleteSessionResponse> => {
  return apiService.del({
    path: `/session/${sessionId}`,
  });
};

export default deleteSession;