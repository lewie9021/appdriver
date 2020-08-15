import { RequestMethod, RequestPayload } from "../request";

interface GetFetchOptionsParams {
  method: RequestMethod;
  payload: RequestPayload;
}

const getFetchOptions = ({ method, payload }: GetFetchOptionsParams): RequestInit => {
  if (payload) {
    return {
      method,
      body: JSON.stringify(payload),
      headers: {"Content-Type": "application/json"},
    }
  }

  return {
    method
  };
};

export default getFetchOptions;