import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
} from "react";
import { GlobalContext } from "../global/state";
import { getJsonToken } from "../utils/jsonTokenUtils";
import useFetch from "./useFetch";

interface Props {
  apiRouteToGetLogs: string;
}

export default function useGetPreviusLogsFor({ apiRouteToGetLogs }: Props) {
  const globalState = useContext(GlobalContext)[0];
  const makeRequest = useFetch({ defaultUrlStart: globalState.apiUrl });

  async function getPreviusLogs(callback: Dispatch<SetStateAction<any>>) {
    const jsonToken = getJsonToken();
    const logs = await makeRequest({
      url: apiRouteToGetLogs,
      token: jsonToken,
    });
    console.log(logs);
    callback((currentLogs) => [...currentLogs, ...logs]);
  }

  return getPreviusLogs;
}
