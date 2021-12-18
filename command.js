/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
module.exports = {};

let commandQueue = { dm: [], other: [] }
let lastTime = 0
let dm = false

register("tick", () => {
    if (commandQueue.dm.length + commandQueue.other.length > 0) {
        if (Date.now() - lastTime > 750 / 2) {
            lastTime = Date.now()

            if (dm) {
                if (commandQueue.dm.length) {
                    ChatLib.say(commandQueue.dm.shift())
                }
            } else {
                if (commandQueue.other.length) {
                    ChatLib.say(commandQueue.other.shift())
                }
            }
            dm = !dm
        }
    }
})

export default commandQueue;