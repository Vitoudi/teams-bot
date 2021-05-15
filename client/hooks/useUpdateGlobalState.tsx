import React, { ReactElement, useContext, useState } from 'react'
import { GlobalContext, GlobalStatePropName } from '../global/state'

interface Props {
  
}

export default function useUpdateGlobalState() {
    const setGlobalState = useContext(GlobalContext)[1]

    function updateGlobalState<T>(propName: GlobalStatePropName, value: T) {
        setGlobalState(state => {
            return {...state, [propName]: value}
        })
    }

    return updateGlobalState
}
