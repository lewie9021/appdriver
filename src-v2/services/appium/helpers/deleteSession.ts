import { ApiService } from "../../api/ApiService";

interface DeleteSessionParams {
  api: ApiService;
  sessionId: string;
}

export type DeleteSessionResponse = null;

const deleteSession = ({ api, sessionId }: DeleteSessionParams): Promise<DeleteSessionResponse> => {
  return api.del({
    path: `/session/${sessionId}`,
  });
};

export default deleteSession;