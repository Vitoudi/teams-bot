import React, { ReactElement, useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../../../global/state";
import useFetch from "../../../../../hooks/useFetch";
import useGetPreviusLogsFor from "../../../../../hooks/useGetPreviusLogsFor";
import { getJsonToken } from "../../../../../utils/jsonTokenUtils";
import LogBox from "../../LogBox";
import styles from '../../../../../styles/LogBox.module.css'
import { getCurrentIsoDate, getDateFromLog } from "../../../../../utils/getDateForLog";
import { ILog } from "../../../../../types&interfaces/interfaces";
import { SocketEventName } from "../../../../../types&interfaces/types";
import Log from './Log'

interface Props {}



export default function InAndOutLogs({}: Props): ReactElement {
  const globalState = useContext(GlobalContext)[0];
  const getPreviousLogs = useGetPreviusLogsFor({
    apiRouteToGetLogs: "/in_and_out_logs",
  });
  const [logs, setLogs] = useState<ILog[]>([]);

  useEffect(() => {
    if (!globalState.socket) return;

    getPreviousLogs(setLogs);
    listenToNewSocketEvents();
  }, []);

  function listenToNewSocketEvents() {
    globalState.socket.on("entered_meeting", (channel) => {
      console.log("entered meeting");
      const log: ILog = { channel, eventName: "entered_meeting", date: getCurrentIsoDate() };
      setLogs(msgs => [...msgs, log]);
    });

    globalState.socket.on("left_meeting", (channel) => {
      const log: ILog = { channel, eventName: "left_meeting", date: getCurrentIsoDate() };
      setLogs(logs => [...logs, log]);
    });
  }


  return (
    <LogBox title="Entradas e saídas">
      {logs.length
        ? logs.map((log) => {
            return (
              <Log log={log}/>
            );
          })
        : ""}
    </LogBox>
  );
}
