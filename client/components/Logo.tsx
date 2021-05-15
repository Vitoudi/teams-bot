import React, { ReactElement } from 'react'
import styles from "../styles/Logo.module.css";

interface Props {
    fontSize?: number;
}

export default function Logo({fontSize}: Props): ReactElement {
  fontSize = fontSize ?? 40;

  return (
    <div style={{fontSize: fontSize + 'px'}} className={styles["logo"]}>
      <span>teams</span> bot
    </div>
  );
}
