import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import Bord from '../components/bord/bord'
import { GlobalContext } from '../global/state'
import * as io from "socket.io-client";
import styles from '../styles/Home.module.css'
import useUpdateGlobalState from '../hooks/useUpdateGlobalState'
import { useRouter } from 'next/router'
import useFetch from '../hooks/useFetch';
import { getJsonToken } from '../utils/jsonTokenUtils';
import Loading from '../components/Loading';
import useGetPreviusLogsFor from '../hooks/useGetPreviusLogsFor';

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const updateGlobalState = useUpdateGlobalState()
 const [globalState, setGlobalState] = useContext(GlobalContext);
 const makeRequest = useFetch({ defaultUrlStart: globalState.apiUrl });

 useEffect(() => {
   const jsonToken = getJsonToken() || ''

   makeRequest({ url: "/check_logged_in", token: jsonToken }).then((response) => {
     const isLoggedIn = response.loggedIn;

     console.log(response)

     if (isLoggedIn) {
       updateGlobalState("isLoggedIn", true);
       router.push("/panel");
     }

     setIsLoading(false)
     connectWithSocket();
   });
   
 }, []);

 function connectWithSocket() {
   const socket = io.connect("http://localhost:8000", {
     withCredentials: true,
   } as any);
   putSocketConnectionOnGlobalState(socket);
 }


 function putSocketConnectionOnGlobalState(socket: SocketIOClient.Socket) {
   setGlobalState((state) => {
     return { ...state, socket };
   });
 }

 if (isLoading) {
   return (
     <div style={{height: '100vh', display: 'grid', alignContent: 'center'}}>
       <Loading msg="" />
     </div>
   );
 }

  return (
    <div>
      <Bord/>
    </div>
  )
}
