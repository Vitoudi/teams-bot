import React, { ReactElement, useContext, useEffect, useState } from 'react'
import useFetch from '../../../hooks/useFetch';
import styles from '../../../styles/Bord.module.css';
import Loading from '../../Loading';
import {useRouter} from 'next/router';
import {GlobalContext} from '../../../global/state';

interface Props {
    
}

export default function RoomSelector({}: Props): ReactElement {
    const [globalState, setGlobalState] = useContext(GlobalContext)
    const router = useRouter();
    const makeRequest = useFetch("http://localhost:8000");
    const [rooms, setRooms] = useState([])
    const [roomName, setRoomName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const url = '/room_names';
        makeRequest({url}).then(roomNames => setRooms(roomNames)).catch(err => console.log(err))
    }, [])

    async function makeRequesToObserveRoom() {
        const url = "/observe_room";
        console.log('name: ', roomName);
        const res = await makeRequest({url, method: "POST", data: {roomName}});

        router.push('/panel')
        updateGlobalState()
    }

    function updateGlobalState() {
      setGlobalState(state => {
        return {...state, isLoggedIn: true};
      });
    }

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const roomName = e.target.value;
        setRoomName(roomName);
    }

    function handleClick() {
      setIsLoading(true)
      makeRequesToObserveRoom();
    }

    if(isLoading) {
      return <Loading msg="Fazendo configurações, aguarde..."/>
    }

    return (
        <div className={styles['select-container']}>
          <h3>Selecione  uma sala para observar:</h3>
          <div>
          {rooms ? <select name="rooms" id="rooms" onChange={handleChange}>
            {rooms.map((room) => {
              return <option value={room}>{room}</option>;
            })}
          </select> : ''}
          <button className="btn" onClick={handleClick}>Observar</button>
          </div>
          
        </div>
    );
}
