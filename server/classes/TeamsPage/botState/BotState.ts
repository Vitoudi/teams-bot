import { Socket } from "socket.io"

interface IBotState {
    isActive: boolean
    socket: any
}

export class BotState {
    isActive: boolean
    socket: Socket
    currentChanelName: string

    constructor(socket: Socket) {
        this.isActive = false
        this.socket = socket
        this.currentChanelName = ''
    }
}