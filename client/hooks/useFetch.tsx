import React, { ReactElement } from 'react'

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

interface MakeRequestOptions {
  url: string
  method?: HttpMethod
  data?: any
  token?: string
}

interface UseFetchOptions {
  defaultUrlStart?: string
  defaultToken?: string
}

export default function useFetch(options?: UseFetchOptions) {
  const urlStart = options?.defaultUrlStart || "";

  function getRequestOptions(method: HttpMethod, data: any, token: string) {
    token = token ?? options?.defaultToken ?? '';

    const getOptions: RequestInit = {
      credentials: "include",
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    
      if(method === "GET") return getOptions;

      const resquestOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer ' + token,
        },
        credentials: 'include',
        body: JSON.stringify(data) ?? "{}",

      };

      console.log(resquestOptions)

      return resquestOptions;
  }

  function checkForErrors(res: Response) {
    const status = res.status.toString();
    const successInRequest = !status.startsWith('4') || !status.startsWith('5') 
    if (successInRequest) return;

    throw new Error(res.statusText)
  }

  async function makeRequest({url, method, data, token}: MakeRequestOptions) {
    method = method || "GET"
    const reqOptions = getRequestOptions(method, data, token)

    const rawRes = await fetch(urlStart + url, reqOptions);

    checkForErrors(rawRes)

    const res = await rawRes.json();

    return res;
  }

  return makeRequest;
}
