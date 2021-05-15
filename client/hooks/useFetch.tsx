import React, { ReactElement } from 'react'

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

export default function useFetch(defaultUrlStart?: string) {
  const urlStart = defaultUrlStart || "";

  function getRequestOptions(method: HttpMethod, data: any) {
    const getOptions: RequestInit = {credentials: "include"}
    
      if(method === "GET") return getOptions;

      const resquestOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data) ?? "{}",
      };

      return resquestOptions;
  }

  async function makeRequest(url: string, method?: HttpMethod, data?: any) {
    method = method || "GET"
    const reqOptions = getRequestOptions(method, data)

    const rawRes = await fetch(urlStart + url, reqOptions);

    const res = await rawRes.json();

    return res;
  }

  return makeRequest;
}
