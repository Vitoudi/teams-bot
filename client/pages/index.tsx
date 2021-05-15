import Head from 'next/head'
import { useContext, useEffect } from 'react'
import Bord from '../components/bord/bord'
import { GlobalContext } from '../global/state'
import * as io from "socket.io-client";
import styles from '../styles/Home.module.css'
import useUpdateGlobalState from '../hooks/useUpdateGlobalState'
import { useRouter } from 'next/router'
import useFetch from '../hooks/useFetch';

export default function Home() {
  const url = "http://localhost:8000";
  const router = useRouter()
  const makeRequest = useFetch(url)
  const updateGlobalState = useUpdateGlobalState()
 const [globalState, setGlobalState] = useContext(GlobalContext);

 useEffect(() => {
   makeRequest("/check_logged_in").then((response) => {
     const isLoggedIn = response.loggedIn;

     if (isLoggedIn) {
        updateGlobalState('isLoggedIn', true)
        router.push('/panel')
     }

     connectWithSocket();
   });
   
 }, []);

 function connectWithSocket() {
   const socket = io.connect("http://localhost:8000", {
     withCredentials: true,
   } as any);
   putSocketConnectionOnGlobalState(socket);
   socket.on("on_connected", (data) => {
     console.log(data);
   });

   socket.on("logged", () => {
     console.log("LOGGED");
   });
 }


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
