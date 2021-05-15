import Head from 'next/head'
import { useContext, useEffect } from 'react'
import Bord from '../components/bord/bord'
import { GlobalContext } from '../global/state'
import useFetch from '../hooks/useFetch'
import * as io from "socket.io-client";
import styles from '../styles/Home.module.css'

export default function Home() {
  const url = "http://localhost:8000";
  const makeRequest = useFetch(url)
 const [globalState, setGlobalState] = useContext(GlobalContext);

 useEffect(() => {
   makeRequest('/setCookies').then(() => {
    const socket = io.connect("http://localhost:8000", {
      withCredentials: true,
    } as any);
    putSocketConnectionOnGlobalState(socket);
    socket.on("on_connected", (data) => {
      console.log(data);
    });

    socket.on("logged", () => {
      console.log('LOGGED');
    });
   })
   
 }, []);


 function putSocketConnectionOnGlobalState(socket: SocketIOClient.Socket) {
   setGlobalState((state) => {
     return { ...state, socket };
   });
 }

  return (
    <div>
      <Bord/>
    </div>
  )
}
