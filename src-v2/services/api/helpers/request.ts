import getQueryString from "./getQueryString";
import getFetchOptions from "./getFetchOptions";
import { AppiumError } from "../../../errors";

export type RequestMethod = "GET" | "PUT" | "POST" | "DELETE";
export type RequestQuery = Record<string, string | number>;
export type RequestPayload = object;

export interface RequestParams {
  method: RequestMethod;
  path: string;
  query?: RequestQuery;
  payload?: RequestPayload;
  transform?: (data: any) => any;
}

const request = ({ method, path, query, payload, transform }: RequestParams) => {
  const url = `${path}${getQueryString(query)}`;
  const options = getFetchOptions({ method, payload });

  return fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        throw new AppiumError(data.value.message, data.status);
      }

      return transform
        ? transform(data)
        : data.value;
    });
};

export default request;