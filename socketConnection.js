import WebsiteCommunicator from "./../soopyApis/websiteCommunicator"
import socketData from "../soopyApis/socketData"
import commandQueue from "./command"

class SbgBotServer extends WebsiteCommunicator {
    constructor() {
        super(socketData.serverNameToId.sbgbot)
    }

    onData(data) {
        if (data.type === "sendMsg") {
            commandQueue.other.push(spamBypass("/gc " + data.msg))
        }
        if (data.type === "sendMsgTo") {
            if (commandQueue.commandsSpeed > commandQueue.commandsSpeedLimit) {
                commandQueue.dm.push(spamBypass("/msg " + data.user + " @sbgbot " + data.msg))
            } else {
                commandQueue.other.push(spamBypass("/gc @" + data.user + ", " + data.msg))
            }
        }
        if (data.type === "guildSetRank") {
            commandQueue.other.push("/g setRank " + data.user + " " + data.rank)
        }
    }

    onConnect() {

    }

    sendMessage(player, message) {
        this.sendData({
            type: "chatMessage",
            user: player,
            msg: message
        })
    }
}

if (!global.sbgBotServer) {
    global.sbgBotServer = new SbgBotServer()

    register("gameUnload", () => {
        global.sbgBotServer = undefined
    })
}

export default global.sbgBotServer

const chars = [
    ",",
    "."
]
const spamBypass = message => {
    for (let i = 0; i < (255 - message.length); i++) {
        let char = chars[Math.floor(Math.random() * chars.length)];
        if (i < 2) char = " "
        message += char;
    }
    return message
}