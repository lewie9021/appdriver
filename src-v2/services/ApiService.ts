import request, { RequestParams } from "./request";

type GetParams = Pick<RequestParams, "path" | "query">;
type PutParams = Pick<RequestParams, "path" | "query" | "payload">;
type PostParams = Pick<RequestParams, "path" | "query" | "payload">;
type DeleteParams = Pick<RequestParams, "path" | "query" | "payload">;

export class ApiService {
  readonly #baseUrl: string;

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl;
  }

  get({ path, query }: GetParams) {
    return request({
      method: "GET",
      path: `${this.#baseUrl}${path}`,
      query
    });
  }

  put({ path, query, payload }: PutParams) {
    return request({
      method: "PUT",
      path: `${this.#baseUrl}${path}`,
      query,
      payload
    });
  }

  post({ path, query, payload }: PostParams) {
    return request({
      method: "POST",
      path: `${this.#baseUrl}${path}`,
      query,
      payload
    });
  }

  del({ path, query, payload }: DeleteParams) {
    return request({
      method: "DELETE",
      path: `${this.#baseUrl}${path}`,
      query,
      payload
    });
  }
}