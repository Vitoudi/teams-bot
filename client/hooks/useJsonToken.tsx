import React, { ReactElement } from 'react'

type GetterAndSetterForJsonToken = [string, (value: string) => void];

export default function useJsonToken(): GetterAndSetterForJsonToken  {
    if (localStorage === undefined) return;

    const jsonTokenRef = "jsonToken";
    const jsonToken = localStorage.getItem(jsonTokenRef) ?? '';

    function setJsonToken(value: string) {
        localStorage.setItem(jsonTokenRef, value)
    }

    return [jsonToken, setJsonToken];
}
