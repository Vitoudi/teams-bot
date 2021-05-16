import React, { ReactElement, useState } from 'react'
import useFetch from '../../../hooks/useFetch';
import {Mode} from '../bord';
import styles from "../../../styles/Bord.module.css";
import Loading from '../../Loading';
import ErrorMsg from './ErrorMsg';
import useUpdateGlobalState from '../../../hooks/useUpdateGlobalState';

interface Props {
    setMode: React.Dispatch<React.SetStateAction<Mode>>
}

export default function LoginForm({setMode}: Props): ReactElement {
  const updateGlobalState = useUpdateGlobalState();
  const makeRequest = useFetch("http://localhost:8000");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchError, setHasFetchError] = useState(false)

  async function makeRequesToInitTeams() {
    
    console.log('makin request to init teams')
    if (!localStorage) return;

    try {
      const url = '/turn_on'
      const jsonToken = await makeRequest({url, method: "POST", data: { email, password } });

      if(typeof jsonToken !== 'string') return

      localStorage.setItem('jsonToken', JSON.stringify(jsonToken))
      setMode("roomSelector")
      setIsLoading(true)
    } catch {
      setHasFetchError(true)
    }
  }

  function handleClick(e: React.MouseEvent) {
    setIsLoading(true)
    e.preventDefault();
    const errorMsgTemplate = "Por favor preencha o campo: ";

    if (!password) {
      setErrorMsg(errorMsgTemplate + "senha");
      return
    }

    if (!email) {
      setErrorMsg(errorMsgTemplate + "email");
      return
    }

    makeRequesToInitTeams()
  }

  if (hasFetchError) {
    return <ErrorMsg msg="Não foi possível iniciar seu teams :("/>
  }

  if(isLoading) {
    return <Loading msg="Seu teams está iniciando, aguarde..."/>
  }

  return (
    <form className={styles['form']}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          name="email"
          id="email"
          placeholder="Email..."
        />

 
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          name="password"
          id="password"
          placeholder="Senha..."
        />


      <button className="btn" onClick={handleClick} type="submit">
        Ok
      </button>
    </form>
  );

}
