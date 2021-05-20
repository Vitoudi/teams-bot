import React, { ReactElement, useEffect, useRef } from "react";
import styles from "../../../../../styles/LogBox.module.css";
import { ILog } from "../../../../../types&interfaces/interfaces";
import { SocketEventName } from "../../../../../types&interfaces/types";
import { getDateFromLog } from "../../../../../utils/getDateForLog";

interface Props {
  log: ILog;
}

export default function Log({ log }: Props): ReactElement {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(scrollLogIntoView, []);

  function scrollLogIntoView() {
    const refContainer = logRef.current;
    refContainer.scrollIntoView();
  }

  function getCorrespondingLogMsg(eventName: SocketEventName) {
    if (eventName === "entered_meeting") return "Entrou";
    if (eventName === "left_meeting") return "Saiu";

    return "Presente";
  }

  function getCorrespondingClassNameForLog(eventName: SocketEventName) {
    if (eventName === "entered_meeting") return "green-log";
    if (eventName === "left_meeting") return "red-log";

    return "";
  }

  return (
    <div ref={logRef} className={styles["log"]}>
      <span
        className={`${styles[getCorrespondingClassNameForLog(log.eventName)]} ${
          styles["log-msg"]
        }`}
      >
        {getCorrespondingLogMsg(log.eventName)} -
      </span>
      {log.channel}
      <span className={styles["date-place"]}>{getDateFromLog(log.date)}</span>
    </div>
  );
}
