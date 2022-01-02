/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
export default "Nothing is here";
import commandQueue from './command.js';
const File = Java.type("java.io.File")
const URL = Java.type("java.net.URL");
const PrintStream = Java.type("java.io.PrintStream");
const Byte = Java.type("java.lang.Byte");

let isSoopy = Player.getUUID().toString().replace(/-/ig, "") === "dc8c39647b294e03ae9ed13ebd65dd29"
// let isSbgAdmin = isSoopy || Player.getUUID().toString().replace(/-/ig, "") === "b9d90392124048bb993f8f1b836657a8" || Player.getUUID().toString().replace(/-/ig, "") === "a80b52f6707a4f8286cabc6e95cf9fdf"
// let inSbg = isSbgAdmin
// const ByteArrayInputStream = Java.type("java.io.ByteArrayInputStream");
// const Base64 = Java.type("java.util.Base64");
// const CompressedStreamTools = Java.type("net.minecraft.nbt.CompressedStreamTools");
let botLoaded = false
register("worldLoad", () => {
    if (botLoaded) return;

    botLoaded = true

    new Thread(() => {
        let res = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/sbgBot/getIsBotUser.json?key=lkRFxoMYwrkgovPRn2zt&uuid=" + Player.getUUID().toString()))
        if (res.success) {

            let latestVer = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/sbgBot/latestVer.json")).version

            let currVer = JSON.parse(FileLib.read("sbgBot", "metadata.json")).version

            if (currVer != latestVer) {
                ChatLib.chat("Updatign sbgBot to version " + latestVer + "...")
                if(!new File("./config/ChatTriggers/modules/sbgBot/.git").exists()){

                    new File("./config/ChatTriggers/modules/sbgBotTempDownload").mkdir()

                    urlToFile("http://soopymc.my.to/api/sbgBot/downloadLatest.zip", "./config/ChatTriggers/modules/sbgBotTempDownload/sbgBot.zip", 10000, 20000)

                    FileLib.unzip("./config/ChatTriggers/modules/sbgBotTempDownload/sbgBot.zip", "./config/ChatTriggers/modules/sbgBotTempDownload/sbgBot/")

                    FileLib.deleteDirectory(new File("./config/ChatTriggers/modules/sbgBot"))

                    new File("./config/ChatTriggers/modules/sbgBotTempDownload/sbgBot/sbgBot").renameTo(new File("./config/ChatTriggers/modules/sbgBot"))

                    FileLib.deleteDirectory(new File("./config/ChatTriggers/modules/sbgBotTempDownload"))

                    Thread.sleep(1000)

                    ChatLib.command("ct load", true)
                    return
                }else{
                    ChatLib.chat("Canceled update due to git folder, please manually update!")
                }
            }

            let guild = res.guild
            inSbg = guild === "5fea32eb8ea8c9724b8e3f3c"
            let skillData = JSON.parse(FileLib.getUrlContent("https://api.hypixel.net/resources/skyblock/skills"))
            ChatLib.chat("Hosting guild chat bot...")
            let lowestBins = {}
            let lowestBinsAvg = {}
            let bazaar = {}
            let scammerData = {}
            let senitherData = {}
            let guildData = {}

            let commandAlias = {
                "cheapestbin": "lowestbin",
                "bin": "lowestbin",
                "leaderboardposition": "lbpos",
                "stoneof": "whatstone",
                "networth": "nw",
                "bz": "bazzar",
                "sc": "scammercheck",
                "scammer": "scammercheck",
                "fetch": "fetchur",
                "stalk": "whatdoing",
                // "fragbot": "getbot",
                // "fragbots": "getbot",
                "ans": "answer",
                "sa": "skillaverage",
                "cata": "dungeon",
                "catacombs": "dungeon",
                "catacomb": "dungeon"
            }

            let commandsSpeed = 0
            let commandsSpeedLimit = 3

            let lastUpdateLowestBins = 0
            let lastCommandOverLimit = false;
            let asf = 0
            let pollName = undefined
            let pollArgs = undefined
            let pollTime = 0
            let pollAnswers = {}

            if (isSoopy) {
                register("command", () => {
                    let html = ""

                    // commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", Possible commands are:"))
                    Object.keys(commandFunctions).forEach((commandF) => {
                        console.log(commandF)
                    })
                    // case "aliases":

                    //     commandQueue.dm.push(spamBypass("/msg " + player + " @soopybot Command aliases "))
                    //     Object.keys(commandAlias).forEach((alias) => {
                    //         commandQueue.dm.push(spamBypass("/msg " + player + " @soopybot " + alias + " runs " + commandAlias[alias]))
                    //     })
                    //     break;

                }).setName("genhtml")
            }


            register("tick", () => {
                commandsSpeed *= 0.9997
                if (commandsSpeed > commandsSpeedLimit) {
                    if (!lastCommandOverLimit) {
                        lastCommandOverLimit = true

                        commandsSpeed++
                        //commandQueue.other.push(spamBypass("/gc @everyone, bot messages in guild chat have been moved to dms due to spam"))
                    }
                } else {
                    if (lastCommandOverLimit) {
                        lastCommandOverLimit = false

                        //commandQueue.other.push(spamBypass("/gc @everyone, bot messages are now back in guild chat"))
                    }
                }
            })

            register("chat", (player, message, e) => {

                //player = player.replace(/(\[[MVIP&0123456789ABCDEFLMNOabcdeflmnor\+]+\])+? /g, "").replace(/\[[A-z]*\]/g, "").replace(/(&[0123456789ABCDEFLMNOabcdeflmnor])|\[|\]| |\+/g, "")
                if (!isSoopy || player.includes("Soopyboo32")) {
                    cancel(e)
                }
                //ChatLib.chat("&r&2SBGBOT > &r&7[DM] " + "&6" + player + "&a" + " -> " + "&r" + message)
            }).setChatCriteria("&dTo &r${player}&r&7: &r&7@sbgbot ${message}&r")
            let i = 100;
            register("tick", () => {
                if (Date.now() - lastUpdateLowestBins > 60 * 1000) {
                    lastUpdateLowestBins = Date.now()
                    new Thread(() => {
                        i++
                        if (i > 60) {
                            i = 0
                            try {
                                scammerData = JSON.parse(FileLib.getUrlContent("https://raw.githubusercontent.com/skyblockz/pricecheckbot/master/scammer.json"))
                                lowestBinsAvg = JSON.parse(FileLib.getUrlContent("http://moulberry.codes/auction_averages_lbin/1day.json")) //Uses moulberrys api, i will maby code my own sometime tho
                                senitherData = JSON.parse(FileLib.getUrlContent("https://hypixel-app-api.senither.com/leaderboard/players/" + guild))
                            } catch (e) { }
                        }
                        let data = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/v2/guild/" + guild))
                        if (data.success) {
                            guildData = data.data
                        }
                        bazaar = JSON.parse(FileLib.getUrlContent("https://sky.shiiyu.moe/api/v2/bazaar")) //Uses leas api, i will maby code my own sometime tho
                        let lowestBinsData = JSON.parse(FileLib.getUrlContent("https://moulberry.codes/lowestbin.json")) //Uses moulberrys api, i will maby code my own sometime tho
                        let lowestBinsNew = {}
                        let petReplace = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"]
                        let petList = ["BAT", "BLAZE", "CHICKEN", "HORSE", "JERRY", "OCELOT", "PIGMAN", "RABBIT", "SHEEP", "SILVERFISH", "WITHER_SKELETON", "SKELETON_HORSE", "WOLF", "ENDERMAN", "PHOENIX", "MAGMA_CUBE", "FLYING_FISH", "BLUE_WHALE", "TIGER", "LION", "PARROT", "SNOWMAN", "TURTLE", "BEE", "ENDER_DRAGON", "GUARDIAN", "SQUID", "GIRAFFE", "ELEPHANT", "MONKEY", "SPIDER", "ENDERMITE", "GHOUL", "JELLYFISH", "PIG", "ROCK", "SKELETON", "ZOMBIE", "DOLPHIN", "BABY_YETI", "MEGALODON", "GOLEM", "HOUND", "TARANTULA", "BLACK_CAT", "SPIRIT", "GRIFFIN"]

                        Object.keys(lowestBinsData).forEach((key) => {
                            let keyNew = key
                            if (key.includes(";")) {
                                let a = key.split(";")
                                if (petList.includes(a[0])) {
                                    keyNew = petReplace[parseInt(a[1])] + "_" + a[0]
                                } else {
                                    keyNew = a[0] + "_" + a[1]
                                }
                            }
                            lowestBinsNew[keyNew] = lowestBinsData[key]
                            lowestBinsNew[key] = lowestBinsData[key]
                        })
                        lowestBins = lowestBinsNew

                        let infoThing = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/sbgBot/getInfo.json?uuid=" + Player.getUUID().toString()))
                        if (infoThing.success) {
                            infoThing.data.forEach((a) => {
                                if (a.action === "reminder") {
                                    commandQueue.other.push(spamBypass("/gc @everyone, " + a.text))
                                }
                                if (a.action === "alert") {
                                    commandQueue.other.push(spamBypass("/gc @everyone, " + a.text))
                                }
                                if (a.action === "gchat") {
                                    commandQueue.other.push("/gc " + a.text)
                                }
                                if (a.action === "setRank") {
                                    commandQueue.other.push("/g setRank " + a.player + " " + a.rank)
                                }
                            })
                        }
                    }).start()
                }
                if (Date.now() - asf > 5 * 1000 && isSoopy) {
                    asf = Date.now()
                    new Thread(() => {
                        let infoThing = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/sbgBot/getInfo.json?uuid=" + Player.getUUID().toString()))
                        if (infoThing.success) {
                            infoThing.data.forEach((a) => {
                                if (a.action === "reminder") {
                                    commandQueue.other.push(spamBypass("/gc @everyone, " + a.text))
                                }
                                if (a.action === "alert") {
                                    commandQueue.other.push(spamBypass("/gc @everyone, " + a.text))
                                }
                                if (a.action === "gchat") {
                                    commandQueue.other.push("/gc " + a.text)
                                }
                                if (a.action === "setRank") {
                                    commandQueue.other.push("/g setRank " + a.player + " " + a.rank)
                                }
                            })
                        }
                    }).start()
                }
            })
            // register("chat",(e)=>{
            //     if(!inSbg) return;f
            //     let mess = (new Message(e)).getFormattedText()

            //     new Thread(()=>{
            //         FileLib.getUrlContent("http://soopymc.my.to/api/sbgDiscord/newGuildChatMessageS.json?key=HoVoiuWfpdAjJhfTj0YN&message=" + encodeURIComponent(mess))
            //     }).start()
            // }).setChatCriteria("&r&3Officer > ${*}")
            // register("chat",(e)=>{
            //     if(!inSbg) return;
            //     let mess = (new Message(e)).getFormattedText()

            //     new Thread(()=>{
            //         FileLib.getUrlContent("http://soopymc.my.to/api/sbgDiscord/newGuildChatMessage.json?key=HoVoiuWfpdAjJhfTj0YN&message=" + encodeURIComponent("&b-----------------------------------------------------&r"))
            //         FileLib.getUrlContent("http://soopymc.my.to/api/sbgDiscord/newGuildChatMessage.json?key=HoVoiuWfpdAjJhfTj0YN&message=" + encodeURIComponent(mess))
            //         FileLib.getUrlContent("http://soopymc.my.to/api/sbgDiscord/newGuildChatMessage.json?key=HoVoiuWfpdAjJhfTj0YN&message=" + encodeURIComponent("&b-----------------------------------------------------&r"))
            //     }).start()
            // }).setChatCriteria("${*} &r&ejoined the guild!&r")
            // register("chat",(e)=>{
            //     if(!inSbg) return;
            //     let mess = (new Message(e)).getFormattedText()

            //     new Thread(()=>{
            //         FileLib.getUrlContent("http://soopymc.my.to/api/sbgDiscord/newGuildChatMessage.json?key=HoVoiuWfpdAjJhfTj0YN&message=" + encodeURIComponent(mess))
            //     }).start()
            // }).setChatCriteria("&r&2Guild > ${*}")

            register("chat", (player, message) => {
                if (message.substr(0, 1) !== "-" && message.substr(0, 1) !== "/") { return }
                player = player.replace(/(\[[MVIP&0123456789ABCDEFLMNOabcdeflmnor\+]+\])+? /g, "").replace(/\[[A-z]*\]/g, "").replace(/(&[0123456789ABCDEFLMNOabcdeflmnor])|\[|\]| |\+/g, "")
                message = message.substr(1, message.length - 1)
                message = message.replace(/ (.)\1+$/g, "").trim()
                let args = message.split(" ")
                let command = args[0]

                ranCommand(player, command, args)

            }).setChatCriteria("&r&2Guild > ${player}&f: &r${message}&r")


            function ranCommand(player, command, args) {

                new Thread(() => {
                    Thread.sleep((commandQueue.other.length + commandQueue.dm.length) * 100)
                    commandsSpeed++

                    let tcommand = commandFunctions[command] || commandFunctions[commandAlias[command]]

                    let rank = guildData.members.filter(f => {
                        return f.playerInfo.uuid === Player.getUUID().replace(/-/g, "")
                    })[0]?.guildInfo?.rank || "notinguildpepega";
                    if (rank === "Staff" || rank === "Guild Master") {
                        tcommand = tcommand || commandFunctionsStaff[command] || commandFunctionsStaff[commandAlias[command]]
                    }

                    if (tcommand) {
                        let res = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/sbgBot/shouldRunCommand.json?key=lkRFxoMYwrkgovPRn2zt&command=" + sha256(player + ": " + args.join(" "))))
                        if (res.result) {
                            tcommand(player, command, args, (message) => {
                                if (commandsSpeed > commandsSpeedLimit) {
                                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + message))
                                } else {
                                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + message))
                                }
                            })
                        }
                        return;
                    }

                }).start()
            }

            let reforgeToStone = {
                "Necrotic": {
                    "name": "Necromancer's Brooch",
                    "id": "NECROMANCER_BROOCH"
                },
                "Perfect": {
                    "name": "Diamond Atom",
                    "id": "DIAMOND_ATOM"
                },
                "Spiked": {
                    "name": "Dragon Scale",
                    "id": "DRAGON_SCALE"
                },
                "Fabled": {
                    "name": "Dragon Claw",
                    "id": "DRAGON_CLAW"
                },
                "Renowned": {
                    "name": "Dragon Horn",
                    "id": "DRAGON_HORN"
                },
                "Undead": {
                    "name": "Premium Flesh",
                    "id": "PREMIUM_FLESH"
                },
                "Cubic": {
                    "name": "Molten Cube",
                    "id": "MOLTEN_CUBE"
                },
                "Silky": {
                    "name": "Luxurious Spool",
                    "id": "LUXURIOUS_SPOOL"
                },
                "Warped": {
                    "name": "End Stone Geode",
                    "id": "ENDSTONE_GEODE"
                },
                "Reinforced": {
                    "name": "Rare Diamond",
                    "id": "RARE_DIAMOND"
                },
                "Magnetic": {
                    "name": "Lapis Crystal",
                    "id": "LAPIS_CRYSTAL"
                },
                "Gilded": {
                    "name": "Midas Jewel",
                    "id": "MIDAS_JEWEL"
                },
                "Fruitful": {
                    "name": "Onyx",
                    "id": "ONYX"
                },
                "Bloody": {
                    "name": "Beating Heart",
                    "id": "BEATING_HEART"
                },
                "Precise": {
                    "name": "Optical Lens",
                    "id": "OPTICAL_LENS"
                },
                "Ridiculous": {
                    "name": "Red Nose",
                    "id": "RED_NOSE"
                },
                "Loving": {
                    "name": "Red Scarf",
                    "id": "RED_SCARF"
                },
                "Suspicious": {
                    "name": "Suspicious Vial",
                    "id": "SUSPICIOUS_VIAL"
                },
                "Spiritual": {
                    "name": "Spirit Stone",
                    "id": ""
                },
                "Warped": {
                    "name": "Warped Stone",
                    "id": "AOTE_STONE"
                },
                "Shaded": {
                    "name": "Dark Orb",
                    "id": "DARK_ORB"
                },
                "Giant": {
                    "name": "Giant Tooth",
                    "id": "GIANT_TOOTH"
                },
                "Empowered": {
                    "name": "Sadan's Brooch",
                    "id": "SADAN_BROOCH"
                },
                "Moil": {
                    "name": "Moil Log",
                    "id": "MOIL_LOG"
                },
                "Dirty": {
                    "name": "Dirty Bottle",
                    "id": "DIRT_BOTTLE"
                },
                "Toil": {
                    "name": "Toil Log",
                    "id": "TOIL_LOG"
                },
                "Refined": {
                    "name": "Refined Amber",
                    "id": "REFINED_AMBER"
                },
                "Blessed": {
                    "name": "Blessed Fruit",
                    "id": "BLESSED_FRUIT"
                },
                "Sweet": {
                    "name": "Rock Candy",
                    "id": "ROCK_CANDY"
                },
                "Candied": {
                    "name": "Candy Corn",
                    "id": "CANDY_CORN"
                },
                "Submerged": {
                    "name": "Deep Sea Orb",
                    "id": "DEEP_SEA_ORB"
                },
                "Ancient": {
                    "name": "Precursor Gear",
                    "id": "PRECURSOR_GEAR"
                },
                "Withered": {
                    "name": "Wither Blood",
                    "id": "WITHER_BLOOD"
                }
            }

            let commandFunctions = {}
            let commandFunctionsNonGuild = {}
            let commandFunctionsStaff = {}
            let mathBad = [
                "ur actually bad and dont know how to make a math equasion!",
                "bald",
                "that is not poggers",
                "ur iq: 0"
            ]

            if (isSoopy || Player.getUUID().toString().replace(/-/g, "") === "9e05662285e34504bafac91a7cbfd501") { //owoenz


                //-----------------------------------------------------
                //             SOOPY BOT POGGGGGGGGGGGGG
                //-----------------------------------------------------

                register("chat", (player, message) => {
                    if (message.substr(0, 1) !== "-" && message.substr(0, 1) !== "/") { return }
                    player = player.replace(/(\[[MVIP&0123456789ABCDEFLMNOabcdeflmnor\+]+\])+? /g, "").replace(/\[[A-z]*\]/g, "").replace(/(&[0123456789ABCDEFLMNOabcdeflmnor])|\[|\]| |\+/g, "")
                    message = message.substr(1, message.length - 1)
                    let args = message.split(" ")
                    let command = args[0]

                    ranCommandNonGuild(player, "pc", command, args)

                }).setChatCriteria("&r&9Party &8> ${player}&f: &r${message}&r")
                register("chat", (player, message) => {
                    if (message.substr(0, 1) !== "-" && message.substr(0, 1) !== "/") { return }
                    player = player.replace(/(\[[MVIP&0123456789ABCDEFLMNOabcdeflmnor\+]+\])+? /g, "").replace(/\[[A-z]*\]/g, "").replace(/(&[0123456789ABCDEFLMNOabcdeflmnor])|\[|\]| |\+/g, "")
                    message = message.substr(1, message.length - 1)
                    let args = message.split(" ")
                    let command = args[0]

                    ranCommandNonGuild(player, "msg " + player, command, args)

                }).setChatCriteria("&dFrom &r${player}&r&7: &r&7${message}&r")//&dFrom &r&b[MVP&r&d+&r&b] VoomDilles&r&7: &r&7/google Boobs&r


                function ranCommandNonGuild(player, responceCommand, command, args) {
                    new Thread(() => {
                        if (commandFunctionsNonGuild[command] == undefined) {
                            if (commandFunctionsNonGuild[commandAlias[command]] == undefined) {
                                //commandQueue.other.push(spamBypass("/gc @" + player + ", " + command + " is not a valid command!"))
                            } else {
                                commandFunctionsNonGuild[commandAlias[command]](player, responceCommand, command, args)
                            }
                        } else {
                            commandFunctionsNonGuild[command](player, responceCommand, command, args)
                            return;
                        }
                    }).start()
                }

                // commandFunctionsNonGuild.getbot = function(player, chatCommand, command, args) {

                //     let bot = []
                //     let leftBots = fragrunbots
                //     for(let i = 0;i<Math.min(10,parseInt(args[1] || "1"));i++){
                //         if(leftBots.length === 0){
                //             break;
                //         }
                //         let rBot = leftBots[Math.floor(Math.random()*leftBots.length)]
                //         bot.push(rBot)
                //         leftBots = leftBots.filter(a=>a!==rBot)
                //     }
                //     if(bot.length > 0){
                //         commandQueue.dm.push(spamBypass("/" + chatCommand + " " + player + ", Random frag bot" + (bot.length>1?"s are ":" is ") + bot.join(", ") + "!"))
                //     }else{
                //         commandQueue.dm.push(spamBypass("/" + chatCommand + " " + player + ", There are no online fragbots!"))
                //     }
                // }
                commandFunctionsNonGuild.whatdoing = function (player, chatCommand, command, args) {
                    let playerCheck = args[1] || player

                    let res = ""

                    let playerData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=player?name=" + playerCheck.replace("_", "^")))
                    let playerUUID = ""

                    if (!playerData.success) {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " " + player + ", Error fetching data: " + playerData.reason))
                        return;
                    }
                    if (!playerData.data.success) {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " " + player + ", Error fetching data! (PlayerData)"))
                        return;
                    }

                    if (playerData.data.player == null) {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " " + player + ", Error fetching data (Invalid player?)"))
                        return;
                    }

                    playerUUID = playerData.data.player.uuid

                    let skyblockData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=skyblock_profiles?uuid=" + playerUUID))

                    if (!skyblockData.success) {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " " + player + ", Error fetching data: " + skyblockData.reason))
                        return;
                    }
                    if (!skyblockData.data.success) {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " " + player + ", Error fetching data! (SbData)"))
                        return;
                    }

                    let last_save = 0

                    let playerProfile = skyblockData.data?.profiles[0] || {}
                    skyblockData.data.profiles.forEach((profile) => {
                        if (profile.members[playerUUID].last_save > last_save) {
                            last_save = profile.members[playerUUID].last_save
                            playerProfile = profile
                        }
                    })
                    let playerProf = playerProfile.members[playerUUID]

                    let statusData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=status?uuid=" + playerUUID))

                    if (statusData.data.session.online) {
                        if (statusData.data.session.gameType === "SKYBLOCK") {
                            switch (statusData.data.session.mode) {
                                case "combat_1":
                                    if (playerProf?.slayer_quest?.type === "spider") {
                                        res = `doing t${playerProf.slayer_quest.tier + 1} tarantulas`
                                        break;
                                    }
                                case "hub":
                                    if (playerProf?.slayer_quest?.type === "wolf") {
                                        res = `doing t${playerProf.slayer_quest.tier + 1} svens (at the hub)`
                                        break;
                                    }
                                    if (playerProf?.slayer_quest?.type === "zombie") {
                                        res = `doing t${playerProf.slayer_quest.tier + 1} revs`
                                        break;
                                    }
                                case "foraging_1":
                                    if (playerProf?.slayer_quest?.type === "wolf") {
                                        res = `doing t${playerProf.slayer_quest.tier + 1} svens (at the park)`
                                        break;
                                    }
                                default:
                                    res = "playing " + statusData.data.session.gameType + " (" + (areaData[statusData.data.session.mode] ? areaData[statusData.data.session.mode].Display || (statusData.data.session.mode) : statusData.data.session.mode) + ")"
                                    break;
                            }
                        } else {
                            res = "playing " + statusData.data.session.gameType + " " + statusData.data.session.mode
                        }
                    } else {
                        res = "offline"
                    }

                    commandQueue.dm.push(spamBypass("/" + chatCommand + " " + player + ", " + playerCheck + " is currently " + res))
                }
                commandFunctionsNonGuild.math = function (player, chatCommand, command, args) {
                    if (args === undefined) {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " " + player + ", invalid equasion!"))
                    }

                    args.shift()

                    let res;
                    try {
                        res = FileLib.getUrlContent("http://api.mathjs.org/v4/?expr=" + encodeURIComponent(args.join(" ")))
                    } catch (e) {
                        res = mathBad[Math.floor(Math.random() * mathBad.length)]
                    }

                    if (/[0-9]\.?[0-9]*e\+[0-9]+/.test(res)) {
                        res = numberWithCommas(parseFloat(res))
                    }

                    commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", " + res))
                }
                commandFunctions.google = function (player, command, args, reply) {
                    if (args[1] == undefined) {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot enter question!"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", enter question!"))
                        }
                        return;
                    }

                    let question = ""
                    let first = true

                    args.forEach((a) => {
                        if (!first) {
                            question += (question === "" ? "" : " ") + a
                        }
                        first = false
                    })

                    let reset
                    try {
                        res = FileLib.getUrlContent("http://soopymc.my.to/api/sbgBot/googleResult.json?i=" + encodeURIComponent(question)).replace("Wolfram|Alpha did not understand your input", "there was an error with your question!")
                    } catch (e) {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot there was an error with your question!"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", there was an error with your question!"))
                        }
                        return;
                    }

                    let responce = [""]

                    res.split(" ").forEach((a) => {
                        if ((responce[responce.length - 1] + a).length > 150) {
                            responce.push(a)
                        } else {
                            responce[responce.length - 1] += " " + a
                        }
                    })

                    responce.forEach((a) => {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + a))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", " + a))
                        }
                    })
                }
                commandFunctions.question = function (player, command, args, reply) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + ((args.join().length % 2) === 1 ? "yes" : "no") + "!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + ((args.join().length % 2) === 1 ? "yes" : "no") + "!"))
                    }
                }
                //
                // commandFunctions.irlworth = function(player, command, args, reply) {
                //     if(args[1] === undefined){
                //         args[1] = 1000000
                //     }else{
                //         args[1] = parseFloat(args[1])
                //     }

                //     if (commandsSpeed > commandsSpeedLimit) {
                //         commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Fetchur is currently " + (data?data:"Unknown") + "."))
                //     } else {
                //         commandQueue.dm.push(spamBypass("/gc @" + player + ", Fetchur is currently " + (data?data:"Unknown") + "."))
                //     }
                // }

                commandFunctionsNonGuild.joke = function (player, chatCommand, command, args) {
                    if (args[1] == "player") {
                        if (args[2] == undefined) {
                            commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", " + joke.value.joke))
                            return;
                        }
                        if (args[3] == undefined) {
                            args[3] = ""
                        }
                        let joke = JSON.parse(FileLib.getUrlContent("http://api.icndb.com/jokes/random?firstName=" + args[2] + "&lastName=" + args[3] + "&escape=javascript"))
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", " + joke.value.joke))
                        return;
                    }

                    if (Math.random() < 0.05) {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", Here is the funniest joke i know..."))
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", " + player))
                        return
                    }
                    let joke = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/sbgBot/joke.json"))
                    commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", " + joke.data.setup))
                    commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", " + joke.data.punchline))
                }

                commandFunctionsNonGuild.soopyaddons = function (player, chatCommand, command, args) {
                    commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", CT is Pepega"))
                }

                commandFunctionsNonGuild.scammercheck = function (player, chatCommand, command, args) {
                    if (args[1] === undefined) {
                        args[1] = player
                    }

                    let playerUUID;
                    try {
                        playerUUID = JSON.parse(FileLib.getUrlContent("https://api.mojang.com/users/profiles/minecraft/" + args[1])).id
                    } catch (e) {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", Invalid player"))
                        return;
                    }
                    let isScammer = scammerData[playerUUID] !== undefined

                    if (!isScammer) {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", " + (player.toLowerCase() === args[1].toLowerCase() ? "You are" : args[1] + " is") + " not a scammer"))
                    } else {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", " + (player.toLowerCase() === args[1].toLowerCase() ? "You are" : args[1] + " is") + " a scammer"))
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", Reason: " + scammerData[playerUUID].reason))
                    }
                }
                commandFunctionsNonGuild.missingpets = function (player, chatCommand, command, args) {
                    if (args[1] === undefined) {
                        args[1] = player
                    }

                    let data = JSON.parse(FileLib.getUrlContent("https://sky.shiiyu.moe/api/v2/profile/" + args[1]))

                    let profile = ""
                    Object.keys(data.profiles).forEach((profileId) => {
                        if (data.profiles[profileId].current) {
                            profile = profileId
                        }
                    })

                    let missingPets = data.profiles[profile].data.missingPets

                    commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", " + (args[1] === player ? "You are" : args[1] + " is") + " missing " + missingPets.length + " pets!"))
                    if (missingPets.length > 0) {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", (" + missingPets.slice(0, 5).map(pet => pet.display_name).join(" | ") + (missingPets.length > 5 ? " | and " + (missingPets.length - 5) + " more" : "") + ")"))
                    }
                }
                commandFunctionsNonGuild.fetchur = function (player, chatCommand, command, args) {

                    let fletcherMessages2 = [
                        "50 red wool",
                        "20 yellow stained glass",
                        "1 compass",
                        "20 mythril",
                        "1 firework rocket",
                        "1 cheap coffee or decent coffee",
                        "1 wooden door",
                        "3 rabbits feet",
                        "1 superboom tnt",
                        "1 pumpkin",
                        "1 flint and steel",
                        "50 nether quartz ore",
                        "16 ender pearl"
                    ]
                    let currFetchur = (fletcherMessages2[(new Date(Date.now() - 5 * 60 * 60 * 1000 + new Date().getTimezoneOffset() * 1000 * 60).getDate()) % fletcherMessages2.length - 1]) || fletcherMessages2[0]
                    let willChangeIn = (1000 * 60 * 60 * 24) - ((Date.now() - 1613624400000) % (1000 * 60 * 60 * 24))
                    let changeH = Math.floor(willChangeIn / (1000 * 60 * 60))
                    let changeM = Math.floor(willChangeIn % (1000 * 60 * 60) / 1000 / 60)
                    let willChangeInText = changeH + " hour" + (changeH === 1 ? "" : "s") + " " + changeM + " min" + (changeM === 1 ? "" : "s")
                    let nextFetchur = (fletcherMessages2[(new Date(Date.now() - 5 * 60 * 60 * 1000 + new Date().getTimezoneOffset() * 1000 * 60 + (1000 * 60 * 60 * 24)).getDate()) % fletcherMessages2.length - 1]) || fletcherMessages2[0]
                    commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", Fetchur is currently " + currFetchur + " and will change to " + nextFetchur + " in " + willChangeInText))
                }
                commandFunctionsNonGuild.google = function (player, chatCommand, command, args) {
                    if (args[1] == undefined) {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", enter question!"))
                        return;
                    }

                    let question = ""
                    let first = true

                    args.forEach((a) => {
                        if (!first) {
                            question += (question === "" ? "" : " ") + a
                        }
                        first = false
                    })

                    let reset
                    try {
                        res = FileLib.getUrlContent("http://soopymc.my.to/api/sbgBot/googleResult.json?i=" + encodeURIComponent(question)).replace("Wolfram|Alpha did not understand your input", "there was an error with your question!")
                    } catch (e) {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", there was an error with your question!"))
                        return;
                    }

                    let responce = [""]

                    res.split(" ").forEach((a) => {
                        if ((responce[responce.length - 1] + a).length > 150) {
                            responce.push(a)
                        } else {
                            responce[responce.length - 1] += " " + a
                        }
                    })

                    responce.forEach((a) => {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", " + a))
                    })
                }

                // commandFunctionsNonGuild.networth = function (player, chatCommand, command, args) {
                //     if (args[1] === undefined) {
                //         args[1] = player
                //     }

                //     let data = JSON.parse(FileLib.getUrlContent("https://sky.shiiyu.moe/api/v2/profile/" + args[1]))
                //     try {
                //         let netWorth = 0
                //         let netWorthLast = 0


                //         function worthChangeVerift() {
                //             if (netWorth.toString() === "NaN" || netWorth.toString() === "undefined") {
                //                 netWorth = netWorthLast
                //             }
                //             netWorthLast = netWorth
                //         }

                //         let items = []
                //         let pets = []

                //         Object.keys(data.profiles).forEach((profId) => {
                //             let itemStorage = ["wardrobe_inventory", "inventory", "enderchest", "talisman_bag", "fishing_bag", "quiver", "potion_bag", "storage"]
                //             let itemStorageReplace = {
                //                 "wardrobe": "wardrobe_inventory",
                //                 "ward": "wardrobe_inventory",
                //                 "invent": "inventory",
                //                 "inv": "inventory",
                //                 "ec": "enderchest",
                //                 "talis": "talisman_bag",
                //                 "fish": "fishing_bag",
                //                 "potion": "potion_bag"
                //             }
                //             itemStorage.forEach((itemLocation) => {
                //                 data.profiles[profId].items[itemLocation].forEach((item) => {
                //                     if (args[2] === undefined || args[2].toLowerCase() === itemLocation || itemStorageReplace[args[2].toLowerCase()] === itemLocation) {
                //                         items.push({ ...item, "location": itemLocation })
                //                     }
                //                 })
                //             })
                //             if (args[2] === undefined || args[2].toLowerCase() === "pets") {
                //                 data.profiles[profId].data.pets.forEach((pet) => {
                //                     pets.push(pet)
                //                 })
                //             }

                //             if (args[2] === undefined) {
                //                 netWorth += data.profiles[profId].raw.coin_purse
                //                 worthChangeVerift()
                //                 netWorth += data.profiles[profId].data.bank
                //                 worthChangeVerift()
                //                 netWorth += data.profiles[profId].data.slayer_coins_spent.total
                //                 worthChangeVerift()
                //             }
                //         })
                //         items.forEach((item) => {
                //             if (item.Count !== undefined) {
                //                 netWorth += getItemWorth(item)
                //                 worthChangeVerift()
                //             }
                //         })
                //         pets.forEach((pet) => {
                //             netWorth += getPetWorth(pet)
                //             worthChangeVerift()
                //         })


                //         netWorth = addNotation("oneLetters", netWorth)
                //         commandQueue.dm.push(spamBypass("/" + chatCommand + " " + player + ", " + (args[1] === player ? "You have" : args[1] + " has") + " a networth of $" + netWorth + "!"))


                //     } catch (e) {
                //         console.log(JSON.stringify(e))
                //         commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", there was an error!"))
                //     }
                // }

                commandFunctionsNonGuild.lowestbin = function (player, chatCommand, command, args) {
                    let vals = {}

                    args.shift()

                    args.forEach((arg) => {
                        Object.keys(lowestBins).forEach((lowestBin) => {
                            if (lowestBin.toLowerCase().includes(arg.toLowerCase())) {
                                if (vals[lowestBin] == undefined) { vals[lowestBin] = 0 }
                                vals[lowestBin]++
                                if (lowestBin.includes("STARRED")) {
                                    vals[lowestBin] -= 0.1
                                }
                            }
                        })
                    })

                    let topItem = undefined
                    let topScore = 0;

                    Object.keys(vals).forEach((val) => {
                        if (vals[val] > topScore) {
                            topItem = val
                            topScore = vals[val]
                        }
                    })

                    if (topItem === undefined) {
                        commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", no auctions found!"))
                        return;
                    }

                    let itemName = topItem.replace(/_/g, " ").toLowerCase()
                    itemName = itemName.substr(0, 1).toUpperCase() + itemName.substr(1)

                    commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", Cheapest bin for " + itemName + " is " + numberWithCommas(lowestBins[topItem]) + "!"))

                }
                commandFunctionsNonGuild.talismans = function (player, chatCommand, command, args) {
                    let playerScan = player
                    if (args[1] !== undefined) {
                        playerScan = args[1]
                    }

                    let stats1 = JSON.parse(FileLib.getUrlContent("https://api.slothpixel.me/api/players/" + playerScan))
                    if (stats1.error === "Player does not exist") {
                        commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", invalid player!"))
                        return;
                    }
                    let stats = JSON.parse(FileLib.getUrlContent("https://api.slothpixel.me/api/skyblock/profile/" + playerScan))

                    let talisData = {}

                    let messageGChat = ""

                    try {
                        let uuid = stats1.uuid
                        let playerName = stats1.username

                        let talisData = stats.members[uuid].talisman_bag

                        let totalTalis = 0
                        let totalRecombedTalis = 0

                        talisData.forEach((talis) => {
                            if (talis.attributes === undefined) {
                                return;
                            }
                            totalTalis++
                            totalRecombedTalis += talis.attributes.rarity_upgrades == 1 ? 1 : 0
                        })

                        messageGChat = playerName + " has a total of " + totalTalis + " talismans (" + totalRecombedTalis + " recombed)"
                    } catch (err) {
                        console.log(JSON.stringify(err))
                        messageGChat = "There was a error :("
                    }

                    commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", " + messageGChat))

                }
                commandFunctionsNonGuild.skill = function (player, chatCommand, command, args) {
                    if (args[1] === undefined || args[2] === undefined) {
                        commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", requires 2 arguments!"))
                        return;
                    }
                    let skillReplace = {
                        "dungeon": "dungeoneering",
                        "catacombs": "dungeoneering"
                    }
                    if (skillReplace[args[1]] !== undefined) {
                        args[1] = skillReplace[args[1]]
                    }

                    if (skillData.collections[args[1].toUpperCase()] === undefined) {
                        commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", invalid skill type!"))
                        return;
                    }

                    args[2] = parseInt(args[2]) - 1


                    if (args[3] !== undefined) {
                        args[3] = parseInt(args[3]) - 1

                        if (skillData.collections[args[1].toUpperCase()].levels[args[3]] === undefined) {
                            commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", invalid skill level!"))
                            return;
                        }

                        let needExp = 0
                        if (args[2] === -1) {
                            needExp = addNotation("oneLetters", skillData.collections[args[1].toUpperCase()].levels[args[3]].totalExpRequired)
                        } else {

                            if (skillData.collections[args[1].toUpperCase()].levels[args[2]] === undefined) {
                                commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", invalid skill level!"))
                                return;
                            }
                            needExp = addNotation("oneLetters", skillData.collections[args[1].toUpperCase()].levels[args[3]].totalExpRequired - skillData.collections[args[1].toUpperCase()].levels[args[2]].totalExpRequired)
                        }


                        let expinfo = "it takes " + needExp + " exp to go from " + firstLetterCapital(args[1].toLowerCase()) + " " + (args[2] + 1) + " -> " + (args[3] + 1)
                        commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", " + expinfo))
                        return;
                    }
                    if (skillData.collections[args[1].toUpperCase()].levels[args[2]] === undefined) {
                        commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", invalid skill level!"))
                        return;
                    }

                    Thread.sleep(500)

                    commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", " + firstLetterCapital(args[1].toLowerCase()) + " " + (args[2] + 1) + " (" + addNotation("oneLetters", skillData.collections[args[1].toUpperCase()].levels[args[2]].totalExpRequired) + " exp)"))
                    skillData.collections[args[1].toUpperCase()].levels[args[2]].unlocks.forEach((unlock) => {
                        commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", " + unlock))
                    })
                }
                commandFunctionsNonGuild.help = function (player, chatCommand, command, args) {

                    if (args[1] === undefined) {
                        commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", Possible commands are:"))
                        Object.keys(commandFunctionsNonGuild).forEach((commandF) => {
                            commandQueue.dm.push(spamBypass("/" + chatCommand + " @" + player + ", " + commandF))
                        })
                    } else {
                        switch (args[1]) {
                            // case "aliases":

                            //     commandQueue.dm.push(spamBypass("/msg " + player + " @soopybot Command aliases "))
                            //     Object.keys(commandAlias).forEach((alias) => {
                            //         commandQueue.dm.push(spamBypass("/msg " + player + " @soopybot " + alias + " runs " + commandAlias[alias]))
                            //     })
                            //     break;

                            default:

                                commandQueue.dm.push(spamBypass("/msg " + player + " @soopybot Help for command " + args[1]))
                                break;
                        }
                    }
                }
            }

            commandFunctions.scammercheck = function (player, command, args, reply) {
                if (args[1] === undefined) {
                    args[1] = player
                }

                let playerUUID = JSON.parse(FileLib.getUrlContent("https://api.mojang.com/users/profiles/minecraft/" + args[1])).id

                let isScammer = scammerData[playerUUID] !== undefined

                if (!isScammer) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (player.toLowerCase() === args[1].toLowerCase() ? "You are" : args[1] + " is") + " not a scammer"))
                    } else {
                        commandQueue.dm.push(spamBypass("/gc @" + player + ", " + (player.toLowerCase() === args[1].toLowerCase() ? "You are" : args[1] + " is") + " not a scammer"))
                    }
                } else {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (player.toLowerCase() === args[1].toLowerCase() ? "You are" : args[1] + " is") + " a scammer"))
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Reason: " + scammerData[playerUUID].reason))
                    } else {
                        commandQueue.dm.push(spamBypass("/gc @" + player + ", " + (player.toLowerCase() === args[1].toLowerCase() ? "You are" : args[1] + " is") + " a scammer"))
                        commandQueue.dm.push(spamBypass("/gc @" + player + ", Reason: " + scammerData[playerUUID].reason))
                    }
                }
            }
            commandFunctions.nextdrag = function(player, command, args, reply){

                let number = Math.max(1, Math.min(10000,parseInt(args[1]))) || 1
                
                let chosenArr = [
                    {
                        name: "Protector Dragon",
                        chance: 4
                    },
                    {
                        name: "Wise Dragon",
                        chance: 4
                    },
                    {
                        name: "Young Dragon",
                        chance: 4
                    },
                    {
                        name: "Strong Dragon",
                        chance: 4
                    },
                    {
                        name: "Old Dragon",
                        chance: 4
                    },
                    {
                        name: "Unstable Dragon",
                        chance: 4
                    },
                    {
                        name: "Superior Dragon",
                        chance: 1
                    }
                ]

                let arrTotal = chosenArr.reduce((total, item) => total + item.chance, 0)
                // console.log(arrTotal)
                let items = {}

                for(let i = 0;i<number;i++){
                    let randomNumber = Math.random()

                    let itemChosen = chosenArr[chosenArr.length-1].name
                    let chosen = false
                    chosenArr.forEach(item=>{
                        if(chosen) return
                        // console.log(item.name, randomNumber, item.chance, arrTotal, item.chance/arrTotal)
                        if(randomNumber<=item.chance/arrTotal){
                            itemChosen = item.name
                            chosen = true
                            return
                        }
                        randomNumber -= item.chance/arrTotal
                    })

                    if(!items[itemChosen]) items[itemChosen] = 0

                    items[itemChosen]++
                }
                if(number === 1){
                    reply(Object.keys(items)[0] + "!")
                }else{
                    if(Object.keys(items).length > 3){
                        if(Object.keys(items).length > 5){
                            reply("Message too long, try with a smaller number")
                        }else{
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + Object.keys(items).map(a=>a+" x"+items[a]).join(", ") + "!"))
                        }
                    }else{
                        reply(Object.keys(items).map(a=>a+" x"+items[a]).join(", ") + "!")
                    }
                }
            }
            commandFunctions.whatdropnext = function (player, command, args, reply) {

                let type = args[1] || "all"
                let number = Math.max(1, Math.min(10000, parseInt(args[2]))) || 1


                let aliases = {
                    "enderman": "eman",
                    "voidgloom": "eman",
                }
                let data = {
                    eman: [
                        {
                            name: "Pocket Espresso Machine",
                            chance: 50
                        },
                        {
                            name: "Handy Blood Chalice",
                            chance: 20
                        },
                        {
                            name: "Void-Conqueror Enderman Skin",
                            chance: 20
                        },
                        {
                            name: "Enchant Rune I",
                            chance: 3
                        },
                        {
                            name: "Judgement Core",
                            chance: 3
                        },
                        {
                            name: "Exceedingly Rare Ender Artifact Upgrader",
                            chance: 3
                        },
                        {
                            name: "Ender Slayer VII",
                            chance: 1
                        }
                    ],
                    rev: [
                        {
                            name: "Snake Rune I",
                            chance: 44
                        },
                        {
                            name: "Beheaded Horror",
                            chance: 22
                        },
                        {
                            name: "Scythe Blade",
                            chance: 11
                        },
                        {
                            name: "Smite VII",
                            chance: 11
                        },
                        {
                            name: "Shard of the Shredded",
                            chance: 11
                        },
                        {
                            name: "Warden Heart",
                            chance: 1
                        }
                    ],
                    sven: [
                        {
                            name: "Red Claw Egg",
                            chance: 25
                        },
                        {
                            name: "Couture Rune I",
                            chance: 25
                        },
                        {
                            name: "Grizzly Bait",
                            chance: 7
                        },
                        {
                            name:  "Overflux Capacitor",
                            chance: 5
                        }
                    ],
                    tara: [
                        {
                            name: "Fly Swatter",
                            chance: 5
                        },
                        {
                            name: "tarantula Talisman",
                            chance: 5
                        },
                        {
                            name:  "Digested Mosquito",
                            chance: 2
                        }
                    ],
                    diana: [
                        {
                            name: "100k Coins",
                            chance: 23
                        },
                        {
                            name: "250k Coins",
                            chance: 19
                        },
                        {
                            name: "500k Coins",
                            chance: 17
                        },
                        {
                            name: "750k Coins",
                            chance: 15
                        },
                        {
                            name: "Crown of Greed",
                            chance: 13
                        },
                        {
                            name: "Washed-up Souvenir",
                            chance: 13
                        },
                        {
                            name: "Antique Remedies",
                            chance: 10
                        },
                        {
                            name: "Crochet Tiger Plushie",
                            chance: 10
                        },
                        {
                            name: "Dwarf Turtle Shelmet",
                            chance: 10
                        },
                        {
                            name: "Daedalux Stick",
                            chance: 5
                        },
                        {
                            name: "Minos Relic",
                            chance: 3
                        },
                        {
                            name:  "Chimera I",
                            chance: 1
                        }
                    ]
                }

                let allIncludes = ["tara", "sven", "rev", "eman"]

                let chosenArr = type === "all" ? flattenArr(allIncludes.map(a=>data[a])) : data[aliases[type] || type]

                let arrTotal = chosenArr.reduce((total, item) => total + item.chance, 0)
                // console.log(arrTotal)
                let items = {}

                for (let i = 0; i < number; i++) {
                    let randomNumber = Math.random()

                    let itemChosen = chosenArr[chosenArr.length - 1].name
                    let chosen = false
                    chosenArr.forEach(item => {
                        if (chosen) return
                        // console.log(item.name, randomNumber, item.chance, arrTotal, item.chance/arrTotal)
                        if (randomNumber <= item.chance / arrTotal) {
                            itemChosen = item.name
                            chosen = true
                            return
                        }
                        randomNumber -= item.chance / arrTotal
                    })

                    if (!items[itemChosen]) items[itemChosen] = 0

                    items[itemChosen]++
                }
                if (number === 1) {
                    reply(Object.keys(items)[0] + "!")
                } else {
                    if (Object.keys(items).length > 3) {
                        if (Object.keys(items).length > 5) {
                            reply("Message too long, try with a smaller number")
                        } else {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + Object.keys(items).map(a => a + " x" + items[a]).join(", ") + "!"))
                        }
                    } else {
                        reply(Object.keys(items).map(a => a + " x" + items[a]).join(", ") + "!")
                    }
                }
            }
            commandFunctions.createpoll = function (player, command, args, reply) {
                args.shift()

                if (player !== "Soopyboo32" && player !== "vNoxus" && player !== "alon1396" && player !== "Leyrox" && player !== "Flarely") {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot you do not have permission to perform this command!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", you do not have permission to perform this command!"))
                    }
                    return;
                }

                args = args.join(" ").split("/").map(a => a.trim())
                let name = args.shift()

                if (args.length > 1) {
                    commandQueue.other.push(spamBypass("/gc @everyone, POLL CREATED! (Ends in 1m)"))
                    commandQueue.other.push(spamBypass("/gc @everyone, USE /ans [answernumber] to answer"))
                    let i = 0
                    commandQueue.other.push(spamBypass("/gc @everyone, Possible answers are: " + args.map((a) => {
                        i++
                        return i + ": " + a
                    }).join(" | ")))

                    pollName = name
                    pollArgs = args
                    pollTime = Date.now()
                    pollAnswers = {}
                    return;
                } else {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot min of 2 options!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", min of 2 options!"))
                    }
                    return;
                }
            }
            commandFunctions.cancelpoll = function (player, command, args, reply) {
                if (player !== "Soopyboo32" && player !== "vNoxus" && player !== "alon1396" && player !== "Leyrox" && player !== "Flarely") {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot you do not have permission to perform this command!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", you do not have permission to perform this command!"))
                    }
                    return;
                }

                pollTime = undefined


                commandQueue.other.push(spamBypass("/gc @everyone, POLL ENDED! (" + pollName + ")"));
                let i = 0
                commandQueue.other.push(spamBypass("/gc @everyone, Results: " + pollArgs.map((a) => {
                    i++
                    return a + ": " + Object.values(pollAnswers).filter(a => a === i).length + " (" + Math.round(Object.values(pollAnswers).filter(a => a === i).length / Object.values(pollAnswers).length * 100) + "%)"
                }).join(" | ")))

                pollName = undefined
                pollArgs = undefined
                pollTime = 0
                pollAnswers = {}
                return;
            }
            commandFunctions.answer = function (player, command, args, reply) {
                if (!pollTime) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot There is no running poll!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", There is no running poll!"))
                    }
                    return;
                }

                let answer = parseInt(args[1])

                if (answer) {
                    if (pollAnswers[player] === undefined) {
                        if (pollArgs.length >= answer) {
                            pollAnswers[player] = answer

                            if (commandsSpeed > commandsSpeedLimit) {
                                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Registered vote!"))
                            } else {
                                commandQueue.other.push(spamBypass("/gc @" + player + ", Registered vote!"))
                            }
                            return;
                        } else {
                            if (commandsSpeed > commandsSpeedLimit) {
                                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Invalid answer!"))
                            } else {
                                commandQueue.other.push(spamBypass("/gc @" + player + ", Invalid answer!"))
                            }
                            return;
                        }
                    } else {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot You have already voted in this poll!"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", You have already voted in this poll!"))
                        }
                        return;
                    }
                } else {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Invalid answer!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Invalid answer!"))
                    }
                    return;
                }
            }
            register("tick", () => {
                if (!pollTime) return;
                if (Date.now() > pollTime + 1000 * 60) {
                    pollTime = undefined


                    commandQueue.other.push(spamBypass("/gc @everyone, POLL ENDED! (" + pollName + ")"));
                    let i = 0
                    commandQueue.other.push(spamBypass("/gc @everyone, Results: " + pollArgs.map((a) => {
                        i++
                        return a + ": " + Object.values(pollAnswers).filter(a => a === i).length + " (" + Math.round(Object.values(pollAnswers).filter(a => a === i).length / Object.values(pollAnswers).length * 100) + "%)"
                    }).join(" | ")))

                    pollName = undefined
                    pollArgs = undefined
                    pollTime = 0
                    pollAnswers = {}
                }
            })
            commandFunctions.fetchur = function (player, command, args, reply) {
                let fletcherMessages2 = [
                    "50 red wool",
                    "20 yellow stained glass",
                    "1 compass",
                    "20 mythril",
                    "1 firework rocket",
                    "1 cheap coffee or decent coffee",
                    "1 wooden door",
                    "3 rabbits feet",
                    "1 superboom tnt",
                    "1 pumpkin",
                    "1 flint and steel",
                    "50 nether quartz ore",
                    "16 ender pearl"
                ]
                let currFetchur = (fletcherMessages2[(new Date(Date.now() - 5 * 60 * 60 * 1000 + new Date().getTimezoneOffset() * 1000 * 60).getDate()) % fletcherMessages2.length - 1]) || fletcherMessages2[0]
                let willChangeIn = (1000 * 60 * 60 * 24) - ((Date.now() - 1613624400000) % (1000 * 60 * 60 * 24))
                let changeH = Math.floor(willChangeIn / (1000 * 60 * 60))
                let changeM = Math.floor(willChangeIn % (1000 * 60 * 60) / 1000 / 60)
                let willChangeInText = changeH + " hour" + (changeH === 1 ? "" : "s") + " " + changeM + " min" + (changeM === 1 ? "" : "s")
                let nextFetchur = (fletcherMessages2[(new Date(Date.now() - 5 * 60 * 60 * 1000 + new Date().getTimezoneOffset() * 1000 * 60 + (1000 * 60 * 60 * 24)).getDate()) % fletcherMessages2.length - 1]) || fletcherMessages2[0]
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Fetchur is currently " + currFetchur + " and will change to " + nextFetchur + " in " + willChangeInText))
                } else {
                    commandQueue.dm.push(spamBypass("/gc @" + player + ", Fetchur is currently " + currFetchur + " and will change to " + nextFetchur + " in " + willChangeInText))
                }
            }

            commandFunctions.stats = function (player, command, args, reply) {
                if (args[1] === undefined) {
                    args[1] = player
                }
                if (commandsSpeed > commandsSpeedLimit) {

                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", DMing you the results :)"))
                }

                try {
                    let playerData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=player?name=" + args[1].replace("_", "^")))
                    let playerUUID = ""

                    if (!playerData.success) {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data: " + playerData.reason))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data: " + playerData.reason))
                        }
                        return;
                    }
                    if (!playerData.data.success) {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data!"))
                        }
                        return;
                    }

                    if (playerData.data.player == null) {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data (Invalid player?)"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data (Invalid player?)"))
                        }
                        return;
                    }

                    playerUUID = playerData.data.player.uuid

                    try {
                        let skyblockData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=skyblock_profiles?uuid=" + playerUUID))

                        if (!skyblockData.success) {
                            if (commandsSpeed > commandsSpeedLimit) {
                                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data: " + skyblockData.reason))
                            } else {
                                commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data: " + skyblockData.reason))
                            }
                            return;
                        }
                        if (!skyblockData.data.success) {
                            if (commandsSpeed > commandsSpeedLimit) {
                                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data!"))
                            } else {
                                commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data!"))
                            }
                            return;
                        }
                        if (skyblockData.data.profiles == null) {
                            if (commandsSpeed > commandsSpeedLimit) {
                                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Player has no skyblock profiles!"))
                            } else {
                                commandQueue.other.push(spamBypass("/gc @" + player + ", Player has no skyblock profiles!"))
                            }
                            return;
                        }

                        let last_save = 0

                        let playerProfile = skyblockData.data.profiles[0]
                        skyblockData.data.profiles.forEach((profile) => {
                            if (profile.members[playerUUID].last_save > last_save) {
                                last_save = profile.members[playerUUID].last_save
                                playerProfile = profile
                            }
                        })
                        let playerProf = playerProfile.members[playerUUID]

                        //let book = new Book(playerProf.player.rank_formatted + " " + playerProf.player.username + "&r&7's skyblock stats")

                        let skillApiOff = false;
                        let slayerApiOff = false;
                        let bankApiOff = false;
                        let playerTotalSlayer = 0;
                        let playerTotalSkillExp = 0;
                        let playerSkillAvg = 0;
                        let playerBankCoins = 0;
                        let fairySouls;
                        let slayerHover = "";
                        let skillHover = "";
                        let petText = "NONE";
                        let petHover = "&aPets\n\n&r";
                        let bankHover = "&aRecent transactions\n\n&r";

                        if (playerProfile.banking == null) {
                            bankApiOff = true
                            bankHover = "&cAPI OFF";
                        } else {
                            playerBankCoins = playerProfile.banking.balance

                            playerProfile.banking.transactions.reverse()
                            for (let i = 0; i < Math.min(10, playerProfile.banking.transactions.length); i++) {
                                bankHover += playerProfile.banking.transactions[i].action === "DEPOSIT" ? "&a+" : "&c-"
                                bankHover += " &6" + numberWithCommas(Math.round(playerProfile.banking.transactions[i].amount)) + "&7,"
                                bankHover += " &e" + timeSince(playerProfile.banking.transactions[i].timestamp) + " ago" + " &7by "
                                if (playerProfile.banking.transactions[i].initiator_name.substr(0, 1) !== "B") {
                                    playerProfile.banking.transactions[i].initiator_name = playerProfile.banking.transactions[i].initiator_name.substr(1)
                                }
                                bankHover += playerProfile.banking.transactions[i].initiator_name + "\n"
                            }
                            bankHover = bankHover.replace(/[^0-9.abcdefghijklmnopqrstuvwxyz+\-, &\n\[\]_]+/gi, "&")
                            bankHover = bankHover.replace("olo Transfer", "Solo Transfer")
                            bankHover = bankHover.substr(0, bankHover.length - 1)
                        }

                        let skyblockSkills = [
                            "combat",
                            "mining",
                            "alchemy",
                            "farming",
                            "taming",
                            "enchanting",
                            "fishing",
                            "foraging",
                            "runecrafting",
                            "carpentry"
                        ]

                        skyblockSkills.forEach((skill) => {
                            if (playerProf["experience_skill_" + skill] === undefined) {
                                skillApiOff = true
                            } else {
                                let skillEXP = playerProf["experience_skill_" + skill]

                                let lvlCap = skillLevelCaps["experience_skill_" + skill]
                                if (skill === "farming") {
                                    try {
                                        lvlCap -= 10
                                        lvlCap += playerProf.jacob2?.perks?.farming_level_cap || 0
                                    } catch (e) { }
                                }

                                let skillData = getLevelByXp(skillEXP, skill === "runecrafting" ? 1 : 0, lvlCap)

                                skillHover += "&r" + firstLetterWordCapital(skill) + ": &7" + Math.round((skillData.level + skillData.progress) * 100) / 100 + "\n&r"
                                if (skill === "carpentry" || skill === "runecrafting") {
                                    return;
                                }
                                playerSkillAvg += (skillData.level + skillData.progress) / (8)
                                playerTotalSkillExp += skillEXP
                            }
                        })
                        skillHover = skillHover.substr(0, skillHover.length - 3)
                        playerSkillAvg = Math.round(playerSkillAvg * 100) / 100

                        Object.keys(playerProf.slayer_bosses).forEach((slayer) => {
                            slayerHover += "&r&6" + firstLetterWordCapital(slayer) + "&7: &r" + numberWithCommas(playerProf.slayer_bosses[slayer].xp) + "\n&r"

                            slayerHover += " &bSlayer level: " + Object.keys(playerProf.slayer_bosses[slayer].claimed_levels).length + "\n&r"

                            let boss_kills_type = [
                                0,
                                1,
                                2,
                                3
                            ]

                            boss_kills_type.forEach((tier) => {
                                slayerHover += " - &7Kills tier " + (tier + 1) + ": " + numberWithCommas(playerProf.slayer_bosses[slayer]["boss_kills_tier_" + tier] || 0) + "\n"
                            })
                            slayerHover += "\n&r"

                            playerTotalSlayer += playerProf.slayer_bosses[slayer].xp
                        })
                        slayerHover = slayerHover.substr(0, slayerHover.length - 3)
                        fairySouls = playerProf.fairy_souls_collected

                        let petTierColor = {
                            "COMMON": "&f",
                            "UNCOMMON": "&a",
                            "RARE": "&9",
                            "EPIC": "&5",
                            "LEGENDARY": "&6"
                        }
                        let rarityNumber = {
                            "COMMON": 1,
                            "UNCOMMON": 2,
                            "RARE": 3,
                            "EPIC": 4,
                            "LEGENDARY": 5
                        }

                        if (playerProf.pets.length > 0) {
                            playerProf.pets = playerProf.pets.sort((a, b) => {
                                if (a.tier !== b.tier) {
                                    return rarityNumber[b.tier] - rarityNumber[a.tier]
                                } else {
                                    return b.exp - a.exp
                                }
                            })


                            for (let i = 0; i < playerProf.pets.length; i++) {
                                if (playerProf.pets[i].heldItem == "PET_ITEM_TIER_BOOST") {
                                    playerProf.pets[i].tier = tierBoostChange[playerProf.pets[i].tier]
                                }
                            }

                            playerProf.pets.forEach((pet) => {
                                if (pet.active) {
                                    petText = "[Lv" + getPetLevel(pet).level + "] " + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " "))
                                }

                                petHover += "&7[Lv" + getPetLevel(pet).level + "] " + petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " ")) + "\n"
                            })

                            petHover = petHover.substr(0, petHover.length - 1)
                        } else {
                            petHover = "&cNo Pets!"
                        }

                        let playerSkillHover

                        if (skillApiOff) {
                            playerSkillHover = "&c" + Math.floor(getPlayerSkill(0, playerTotalSlayer) * 1.5)
                        } else {
                            playerSkillHover = "&a" + getPlayerSkill(playerTotalSkillExp, playerTotalSlayer)
                        }


                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + playerData.data.player.displayname + "'s skyblock stats"))
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Purse Coins: " + addNotation("oneLetters", playerProf.coin_purse)))
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Bank Coins: " + (bankApiOff ? "API OFF" : addNotation("oneLetters", playerBankCoins))))
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Skill Avg: " + (skillApiOff ? "API OFF" : playerSkillAvg)))
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Total Slayer: " + (slayerApiOff ? "API OFF" : addNotation("oneLetters", playerTotalSlayer))))
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Fairy souls: " + numberWithCommas(fairySouls)))
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Pet: " + petText))

                        // pagemsg.addTextComponent(
                        //     new TextComponent(ChatLib.addColor(playerData.data.player.displayname + "&7's skyblock stats"))
                        //         .setHover("show_text", ChatLib.addColor("&aPlayer skill: " + playerSkillHover))
                        // )
                        // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))


                        // pagemsg.addTextComponent(
                        //     new TextComponent(ChatLib.addColor("&3Purse Coins: &7" + addNotation("oneLetters", playerProf.coin_purse)))
                        // )
                        // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

                        // pagemsg.addTextComponent(
                        //     new TextComponent(ChatLib.addColor("&3Bank Coins: &7" + (bankApiOff ? "API OFF" : addNotation("oneLetters", playerBankCoins))))
                        //         .setHover("show_text", ChatLib.addColor(bankHover))
                        // )
                        // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

                        // pagemsg.addTextComponent(
                        //     new TextComponent(ChatLib.addColor("&3Skill Avg: &7" + (skillApiOff ? "API OFF" : playerSkillAvg)))
                        //         .setHover("show_text", ChatLib.addColor(skillHover))
                        // )
                        // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

                        // pagemsg.addTextComponent(
                        //     new TextComponent(ChatLib.addColor("&3Total Slayer: &7" + (slayerApiOff ? "API OFF" : addNotation("oneLetters", playerTotalSlayer))))
                        //         .setHover("show_text", ChatLib.addColor(slayerHover))
                        // )
                        // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

                        // pagemsg.addTextComponent(
                        //     new TextComponent(ChatLib.addColor("&3Fairy souls: &7" + numberWithCommas(fairySouls)))
                        // )
                        // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

                        // pagemsg.addTextComponent(
                        //     new TextComponent(ChatLib.addColor("&3Pet: &7" + petText))
                        //         .setHover("show_text", ChatLib.addColor(petHover))
                        // )
                        // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

                        // pagemsg.chat()
                        //book.addPage(pagemsg)

                        //book.display()
                    } catch (err) {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error: " + err))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", Error: " + err))
                        }
                    }
                } catch (err) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error: " + err))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Error: " + err))
                    }
                }
            }

            commandFunctionsStaff.guildrankschange = function (player, command, args, reply) {

                let uuid = senitherData.data.filter(e => {
                    return e.username === player
                })[0]?.uuid

                if (!uuid) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot could not find you on the guild leaderboard! give it up to a day to update."))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", could not find you on the guild leaderboard! give it up to a day to update."))
                    }
                    return;
                }

                let rank = guildData.members.filter(f => {
                    return f.playerInfo.uuid === uuid.replace(/-/g, "")
                })[0]?.guildInfo?.rank || "notinguildpepega";

                if (rank !== "Staff" && rank !== "Guild Master") {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot you do not have permission to perform this command!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", you do not have permission to perform this command!"))
                    }
                    return;
                }

                let players = senitherData.data.filter(e => {
                    let rank = guildData.members.filter(f => {
                        return f.playerInfo.uuid === e.uuid.replace(/-/g, "")
                    })[0]?.guildInfo?.rank || "notinguildpepega";

                    return rank === "Member" || rank === "Elite" || rank === "Skyblock King" || rank === "Skyblock God"
                }).sort((a, b) => {
                    return b.weight - a.weight
                })

                players.forEach((p, rank) => {
                    let pRank = rank + 1
                    let currRank = guildData.members.filter(f => {
                        return f.playerInfo.uuid === p.uuid.replace(/-/g, "")
                    })[0]?.guildInfo?.rank || "notinguildpepega";

                    let needRank = 'Member'

                    if (pRank <= 60) {
                        needRank = "Elite"
                    }
                    if (pRank <= 20) {
                        needRank = "Skyblock King"
                    }
                    if (pRank <= 5) {
                        needRank = "Skyblock God"
                    }

                    if (currRank !== needRank) {
                        commandQueue.other.push("/g setrank " + p.username + " " + needRank)
                    }
                })

                commandQueue.other.push(spamBypass("/gc @everyone, finished updating ranks!"))
            }

            commandFunctions.lowestbin = function (player, command, args, reply) {
                let vals = {}

                args.shift()

                args.forEach((arg) => {
                    Object.keys(lowestBins).forEach((lowestBin) => {
                        if (lowestBin.toLowerCase().includes(arg.toLowerCase())) {
                            if (vals[lowestBin] == undefined) { vals[lowestBin] = 0 }
                            vals[lowestBin]++
                            vals[lowestBin] -= 0.01 * lowestBin.length
                        }
                    })
                })

                let topItem = undefined
                let topScore = 0;

                Object.keys(vals).forEach((val) => {
                    if (vals[val] > topScore) {
                        topItem = val
                        topScore = vals[val]
                    }
                })

                if (topItem === undefined) {
                    reply("No auctions found!")
                    return;
                }

                let itemName = topItem.replace(/_/g, " ").toLowerCase()
                itemName = itemName.substr(0, 1).toUpperCase() + itemName.substr(1)

                reply("Cheapest bin for " + itemName + " is " + numberWithCommas(lowestBins[topItem]) + "!")

            }
            commandFunctions.skillaverage = function (player, command, args, reply) {

                let uuidData
                try {
                    uuidData = JSON.parse(FileLib.getUrlContent("https://api.mojang.com/users/profiles/minecraft/" + (args[1] || player)))
                } catch (e) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Invalid Username!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Invalid Username!"))
                    }
                    return;
                }

                let data = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getPlayerSkill.json?key=lkRFxoMYwrkgovPRn2zt&uuid=" + uuidData.id))

                if (data.success) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + uuidData.name + "'s skill average: " + data["skill-avg"]))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + uuidData.name + "'s skill average: " + data["skill-avg"]))
                    }
                } else {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error! (" + data.reason + ")"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Error! (" + data.reason + ")"))
                    }
                }

            }
            commandFunctions.slayer = function (player, command, args, reply) {

                let uuidData
                try {
                    uuidData = JSON.parse(FileLib.getUrlContent("https://api.mojang.com/users/profiles/minecraft/" + (args[1] || player)))
                } catch (e) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Invalid Username!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Invalid Username!"))
                    }
                    return;
                }

                let data = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getPlayerSkill.json?key=lkRFxoMYwrkgovPRn2zt&uuid=" + uuidData.id))

                if (data.success) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + uuidData.name + "'s total slayer exp: " + numberWithCommas(data["slayer-total"])))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + uuidData.name + "'s total slayer exp: " + numberWithCommas(data["slayer-total"])))
                    }
                } else {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error! (" + data.reason + ")"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Error! (" + data.reason + ")"))
                    }
                }

            }

            commandFunctions.dungeon = function (player, command, args, reply) {

                let uuidData
                try {
                    uuidData = JSON.parse(FileLib.getUrlContent("https://api.mojang.com/users/profiles/minecraft/" + (args[1] || player)))
                } catch (e) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Invalid Username!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Invalid Username!"))
                    }
                    return;
                }

                let data = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getPlayerSkill.json?key=lkRFxoMYwrkgovPRn2zt&uuid=" + uuidData.id))

                if (data.success) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + uuidData.name + "'s catacombs level: " + data["dungeon"]))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + uuidData.name + "'s catacombs level: " + data["dungeon"]))
                    }
                } else {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error! (" + data.reason + ")"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Error! (" + data.reason + ")"))
                    }
                }

            }
            commandFunctions.secrets = function (player, command, args, reply) {

                let data = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/v2/player/" + (args[1] || player)))

                if (!data.data.exists) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + data.data.username + " does not exist!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + data.data.username + " does not exist!"))
                    }
                    return
                }

                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + data.data.username + "'s dungeon secrets: " + numberWithCommas(data.data.stats.achievements.skyblock.dungeon_secrets || 0)))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + data.data.username + "'s dungeon secrets: " + numberWithCommas(data.data.stats.achievements.skyblock.dungeon_secrets || 0)))
                }

            }
            commandFunctions.weight = function (player, command, args, reply) {

                let data = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/v2/player/" + (args[1] || player)))

                if (!data.data.exists) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + data.data.username + " does not exist!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + data.data.username + " does not exist!"))
                    }
                    return
                }
                let data2 = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/v2/player_skyblock/" + (data.data.uuid) + "?key=dee67f9c765cf8df"))

                let weightData = data2.data.profiles[data2.data.stats.bestProfileId].members[data.data.uuid].weight
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + data.data.username + "'s weight: " + numberWithCommas(Math.round(weightData.total)) + " (Skill: " + numberWithCommas(Math.round(weightData.skill.total)) + ", Slayer: " + numberWithCommas(Math.round(weightData.slayer.total)) + ", Dungeons: " + numberWithCommas(Math.round(weightData.dungeons.total)) + ")"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + data.data.username + "'s weight: " + numberWithCommas(Math.round(weightData.total)) + " (Skill: " + numberWithCommas(Math.round(weightData.skill.total)) + ", Slayer: " + numberWithCommas(Math.round(weightData.slayer.total)) + ", Dungeons: " + numberWithCommas(Math.round(weightData.dungeons.total)) + ")"))
                }

            }

            commandFunctions.bazzar = function (player, command, args, reply) {
                let vals = {}

                args.forEach((arg) => {
                    if (arg == "bazzar") {
                        return;
                    }
                    Object.keys(bazaar).forEach((bazItem) => {
                        if (bazaar[bazItem].name.toLowerCase().includes(arg.toLowerCase())) {
                            if (vals[bazItem] == undefined) { vals[bazItem] = 0 }
                            vals[bazItem]++
                            vals[bazItem] -= 0.01 * bazaar[bazItem].name.length
                        }
                    })
                })

                let topItem = undefined
                let topScore = 0;

                Object.keys(vals).forEach((val) => {
                    if (vals[val] > topScore) {
                        topItem = val
                        topScore = vals[val]
                    }
                })

                if (topItem === undefined) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot no item found!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", no item found!"))
                    }
                    return;
                }

                let itemName = bazaar[topItem].name

                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Insta buy for " + itemName + " is " + numberWithCommas(Math.round(bazaar[topItem].buyPrice)) + " Insta sell is " + numberWithCommas(Math.round(bazaar[topItem].sellPrice)) + "!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", Insta buy for " + itemName + " is " + numberWithCommas(Math.round(bazaar[topItem].buyPrice)) + " Insta sell is " + numberWithCommas(Math.round(bazaar[topItem].sellPrice)) + "!"))
                }

            }
            commandFunctions.help = function (player, command, args, reply) {
                if (commandsSpeed > commandsSpeedLimit) {

                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + " DMing you the results, make sure to have your dms open :)"))
                }

                if (args[1] === undefined) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Possible commands are:"))
                    let helpLines = [""]
                    Object.keys(commandFunctions).forEach((commandF) => {
                        if (helpLines[helpLines.length - 1].length > 100) {
                            helpLines[helpLines.length] = commandF
                        } else {
                            helpLines[helpLines.length - 1] += ", " + commandF
                        }
                    })
                    helpLines.forEach((commandF) => {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + commandF))
                    })
                } else {
                    switch (args[1]) {
                        case "aliases":

                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Command aliases "))
                            Object.keys(commandAlias).forEach((alias) => {
                                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + alias + " runs " + commandAlias[alias]))
                            })
                            break;

                        default:

                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Help for command " + args[1]))
                            break;
                    }
                }
            }
            commandFunctions.joke = function (player, command, args, reply) {

                if (args[1] == "player") {
                    if (args[3] == undefined) {
                        args[3] = ""
                    }
                    let joke = JSON.parse(FileLib.getUrlContent("http://api.icndb.com/jokes/random?firstName=" + args[2] + "&lastName=" + args[3] + "&escape=javascript"))

                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + joke.value.joke))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + joke.value.joke))
                    }
                    return;
                }

                if (Math.random() < 0.05 && !(commandsSpeed > commandsSpeedLimit)) {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", Here is the funniest joke i know..."))
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + player))
                    return
                }
                let joke = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/sbgBot/joke.json"))
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + joke.data.setup))
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + joke.data.punchline))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + joke.data.setup))
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + joke.data.punchline))
                }
            }
            commandFunctions.math = function (player, command, args, reply) {
                if (args === undefined) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid equasion!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", invalid equasion!"))
                    }
                }

                args.shift()

                let res;
                try {
                    res = FileLib.getUrlContent("http://api.mathjs.org/v4/?expr=" + encodeURIComponent(args.join(" ")))
                } catch (e) {
                    res = mathBad[Math.floor(Math.random() * mathBad.length)]
                }

                if (/[0-9]\.?[0-9]*e\+[0-9]+/.test(res)) {
                    res = numberWithCommas(parseFloat(res))
                }

                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + res))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + res))
                }
            }
            commandFunctions.whatdoing = function (player, command, args, reply) {
                let playerCheck = args[1] || player

                let res = ""

                let playerData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=player?name=" + playerCheck.replace("_", "^")))
                let playerUUID = ""

                if (!playerData.success) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data: " + playerData.reason))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data: " + playerData.reason))
                    }
                    return;
                }
                if (!playerData.data.success) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data! (PlayerData)"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data! (PlayerData)"))
                    }
                    return;
                }

                if (playerData.data.player == null) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data (Invalid player?)"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data (Invalid player?)"))
                    }
                    return;
                }

                playerUUID = playerData.data.player.uuid

                let skyblockData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=skyblock_profiles?uuid=" + playerUUID))

                if (!skyblockData.success) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data: " + skyblockData.reason))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data: " + skyblockData.reason))
                    }
                    return;
                }
                if (!skyblockData.data.success) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data! (SbData)"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data! (SbData)"))
                    }
                    return;
                }

                let last_save = 0

                let playerProfile = skyblockData.data?.profiles[0] || {}
                skyblockData.data.profiles.forEach((profile) => {
                    if (profile.members[playerUUID].last_save > last_save) {
                        last_save = profile.members[playerUUID].last_save
                        playerProfile = profile
                    }
                })
                let playerProf = playerProfile.members[playerUUID]

                let statusData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=status?uuid=" + playerUUID))

                if (statusData.data.session.online) {
                    if (statusData.data.session.gameType === "SKYBLOCK") {
                        switch (statusData.data.session.mode) {
                            case "combat_1":
                                if (playerProf?.slayer_quest?.type === "spider") {
                                    res = `doing t${playerProf.slayer_quest.tier + 1} tarantulas`
                                    break;
                                }
                            case "hub":
                                if (playerProf?.slayer_quest?.type === "wolf") {
                                    res = `doing t${playerProf.slayer_quest.tier + 1} svens (at the hub)`
                                    break;
                                }
                                if (playerProf?.slayer_quest?.type === "zombie") {
                                    res = `doing t${playerProf.slayer_quest.tier + 1} revs`
                                    break;
                                }
                            case "combat_3":
                                if (playerProf?.slayer_quest?.type === "enderman") {
                                    res = `doing t${playerProf.slayer_quest.tier + 1} Voidgloom Seraphs`
                                    break;
                                }
                            case "foraging_1":
                                if (playerProf?.slayer_quest?.type === "wolf") {
                                    res = `doing t${playerProf.slayer_quest.tier + 1} svens (at the park)`
                                    break;
                                }
                            default:
                                res = "playing " + statusData.data.session.gameType + " (" + (areaData[statusData.data.session.mode] ? areaData[statusData.data.session.mode].Display || (statusData.data.session.mode) : statusData.data.session.mode) + ")"
                                break;
                        }
                    } else {
                        res = "playing " + statusData.data.session.gameType + " " + statusData.data.session.mode
                    }
                } else {
                    res = "offline"
                }

                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + playerCheck + " is currently " + res))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + playerCheck + " is currently " + res))
                }
            }
            // commandFunctions.networth = function (player, command, args) {

            //     let uuidData
            //     try {
            //         uuidData = JSON.parse(FileLib.getUrlContent("https://api.mojang.com/users/profiles/minecraft/" + (args[1] || player)))
            //     } catch (e) {
            //         if (commandsSpeed > commandsSpeedLimit) {
            //             commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Invalid Username!"))
            //         } else {
            //             commandQueue.other.push(spamBypass("/gc @" + player + ", Invalid Username!"))
            //         }
            //         return;
            //     }
            //     let data2 = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/v2/player_skyblock/" + (uuidData.id) + "/nw" + (args[2] === "current" ? "/current/" : "") + "?key=dee67f9c765cf8df"))

            //     let nw = args[2] === "current" ? data2.data.profiles[data2.data.stats.currentProfileId].members[uuidData.id].networth : data2.data.stats.networth

            //     let status = nw.status
            //     let cause = nw.cause

            //     if (status !== 200) {
            //         if (commandsSpeed > commandsSpeedLimit) {
            //             commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Status: " + status + ", cause: " + cause))
            //         } else {
            //             commandQueue.other.push(spamBypass("/gc @" + player + ", Status: " + status + ", cause: " + cause))
            //         }
            //         return;
            //     }

            //     let totalnw = nw.total
            //     // totalnw += data2.data.profiles[ args[2] === "current" ?data2.data.stats.currentProfileId:data2.data.stats.bestProfileId].stats.bank_balance || 0

            //     if (commandsSpeed > commandsSpeedLimit) {
            //         commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + uuidData.name + "'s (maro) networth: " + (numberWithCommas(Math.floor(totalnw)))))
            //     } else {
            //         commandQueue.other.push(spamBypass("/gc @" + player + ", " + uuidData.name + "'s (maro) networth: " + (numberWithCommas(Math.floor(totalnw)))))
            //     }
            // }
            commandFunctions.progress = function (player, command, args) {
                args.shift()
                let uuidData
                try {
                    uuidData = JSON.parse(FileLib.getUrlContent("https://api.mojang.com/users/profiles/minecraft/" + (args[1] || player)))
                } catch (e) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Invalid Username!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Invalid Username!"))
                    }
                    return;
                }

                let data2 = JSON.parse(FileLib.getUrlContent("https://hypixel-app-api.senither.com/leaderboard/player/" + add_dashes_to_uuid(uuidData.id)))

                let currData = data2.data[0]
                let lastWeekData = undefined
                data2.data.forEach(d => {
                    if (Date.now() - new Date(d.updated_at).getTime() <= 7 * 24 * 60 * 60 * 1000) {
                        lastWeekData = d
                    }
                })

                let thing = args[0]

                let oD = lastWeekData[thing]
                let cD = currData[thing]
                let change = Math.round((cD - oD) * 100) / 100

                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + uuidData.name + " has gained " + numberWithCommas(change) + " " + thing + " in the last week! (" + numberWithCommas(oD) + " -> " + numberWithCommas(cD) + ")"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + uuidData.name + " has gained " + numberWithCommas(change) + " " + thing + " in the last week! (" + numberWithCommas(oD) + " -> " + numberWithCommas(cD) + ")"))
                }
            }
            commandFunctions.nw = function (player, command, args, reply) {
                if (args[1] === undefined) {
                    args[1] = player
                }

                
                let uuidData
                try {
                    uuidData = JSON.parse(FileLib.getUrlContent("https://api.mojang.com/users/profiles/minecraft/" + (args[1])))
                } catch (e) {
                    reply("Invalid Username!")
                    return;
                }
                
                let data2 = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/v2/player_skyblock/" + (uuidData.id) + "?key=dee67f9c765cf8df&items"))
                let data3 = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/v2/leaderboard/networth/user/" + (uuidData.id) + "?key=dee67f9c765cf8df&items"))

                let nw = args[1] === "current" ? data2.data.profiles[data2.data.stats.currentProfileId].members[uuidData.id].soopyNetworth : data2.data.profiles[data2.data.stats.bestProfileId].members[uuidData.id].soopyNetworth

                let totalnw = nw.networth
                let position = (data3?.data?.data?.position)
                // totalnw += data2.data.profiles[data2.data.stats.bestProfileId].stats.bank_balance || 0

                reply(uuidData.name + "'s networth: $" + (numberWithCommas(Math.floor(totalnw))) + (position ? " (#" + numberWithCommas(position) + ")" : ""))
            }

            function getItemWorth(item) {
                let worth = 0;
                let worthLast = 0;

                function worthChangeVerift() {
                    if (worth.toString() === "NaN" || worth.toString() === "undefined") {
                        worth = worthLast
                    }
                    worthLast = worth
                }

                try {
                    if (item.tag !== undefined) {
                        if (item.tag.ExtraAttributes !== undefined) {
                            let alb = undefined
                            if (bazaar[item.tag.ExtraAttributes.id] === undefined) {
                                worth += getAverageLowestBin(item.tag.ExtraAttributes.id)
                                alb = getAverageLowestBin(item.tag.ExtraAttributes.id)
                            } else {
                                worth += bazaar[item.tag.ExtraAttributes.id].price
                            }
                            worthChangeVerift()
                            if (alb && alb > 50000) {
                                worth += bazaar.RECOMBOBULATOR_3000.price * item.tag.ExtraAttributes.rarity_upgrades
                            }
                            worthChangeVerift()
                            worth += bazaar.HOT_POTATO_BOOK.price * Math.min(10, item.tag.ExtraAttributes.hot_potato_count)
                            worthChangeVerift()
                            worth += bazaar.FUMING_POTATO_BOOK.price * Math.max(0, item.tag.ExtraAttributes.hot_potato_count - 10)
                            worthChangeVerift()
                            if (item.tag.ExtraAttributes.ability_scroll !== undefined) {
                                item.tag.ExtraAttributes.ability_scroll.forEach((scrollId) => {
                                    worth += getAverageLowestBin(scrollId)
                                    worthChangeVerift()
                                })
                            }
                            if (item.tag.ExtraAttributes.gems !== undefined) {
                                Object.keys(item.tag.ExtraAttributes.gems).forEach(gem => {
                                    let gemId = item.tag.ExtraAttributes.gems[gem] + "_"
                                    let a = gem.split("_")
                                    a.pop()
                                    gemId += a.join("_")
                                    gemId += "_GEM"

                                    if (bazaar[gemId]) {
                                        worth += (bazaar[gemId].price || 0)
                                        worthChangeVerift()
                                    }
                                })
                            }
                            try {
                                item.tag.ExtraAttributes.enchantments.forEach((enchant) => {
                                    worth += getAverageLowestBin(enchant + ";" + item.tag.ExtraAttributes.enchantments[enchant])
                                    worthChangeVerift()
                                })
                            } catch (e) { }
                            if (reforgeToStone[item.tag.ExtraAttributes.modifier] !== undefined) {
                                worth += getAverageLowestBin(reforgeToStone[item.tag.ExtraAttributes.modifier].id)
                                worthChangeVerift()
                            }
                        }
                    }
                    //ChatLib.chat(item.tag.ExtraAttributes.id + ": " + lowestBinsAvg[item.tag.ExtraAttributes.id])
                } catch (e) {
                    console.log(JSON.stringify(e))
                }

                if (item.containsItems !== undefined) {
                    item.containsItems.forEach((item2) => {
                        if (item2.Count !== undefined) {
                            worth += getItemWorth(item2)
                        }
                    })
                }

                return worth * item.Count;
            }


            function getAverageLowestBin(item) {
                if (lowestBinsAvg[item] === undefined) {
                    return lowestBins[item]
                } else {
                    if (lowestBinsAvg[item] < 0) {
                        return lowestBins[item]
                    }
                    return lowestBinsAvg[item]
                }
            }

            function getPetWorth(pet) {
                let worth = 0;
                let worthLast = 0;

                let petReplace = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"]

                function worthChangeVerift() {
                    if (worth.toString() === "NaN" || worth.toString() === "undefined") {
                        worth = worthLast
                    }
                    worthLast = worth
                }

                try {
                    worth += getAverageLowestBin(pet.type + ";" + petReplace.indexOf(pet.tier))
                    worthChangeVerift()
                    worth += getAverageLowestBin(pet.heldItem)
                    worthChangeVerift()
                    worth += getAverageLowestBin("PET_SKIN_" + pet.skin)
                    worthChangeVerift()
                    //ChatLib.chat(item.tag.ExtraAttributes.id + ": " + lowestBinsAvg[item.tag.ExtraAttributes.id])
                } catch (e) {
                    console.log(JSON.stringify(e))
                }

                //console.log(pet.type + " " + pet.tier + ": $" + addNotation("oneLetters", worth))
                return worth;
            }

            commandFunctions.missingpets = function (player, command, args, reply) {
                if (args[1] === undefined) {
                    args[1] = player
                }

                let data = JSON.parse(FileLib.getUrlContent("https://sky.shiiyu.moe/api/v2/profile/" + args[1]))

                let profile = ""
                Object.keys(data.profiles).forEach((profileId) => {
                    if (data.profiles[profileId].current) {
                        profile = profileId
                    }
                })

                let missingPets = data.profiles[profile].data.missingPets

                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (args[1] === player ? "You are" : args[1] + " is") + " missing " + missingPets.length + " pets!"))
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot (" + missingPets.slice(0, 5).map(pet => pet.display_name).join(" | ") + (missingPets.length > 5 ? " | and " + (missingPets.length - 5) + " more" : "") + ")"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + (args[1] === player ? "You are" : args[1] + " is") + " missing " + missingPets.length + " pets!"))
                    commandQueue.other.push(spamBypass("/gc @" + player + ", (" + missingPets.slice(0, 5).map(pet => pet.display_name).join(" | ") + (missingPets.length > 5 ? " | and " + (missingPets.length - 5) + " more" : "") + ")"))
                }
            }
            commandFunctions.missingtalis = function (player, command, args, reply) {
                if (args[1] === undefined) {
                    args[1] = player
                }

                let data = JSON.parse(FileLib.getUrlContent("https://sky.shiiyu.moe/api/v2/profile/" + args[1]))

                let profile = ""
                Object.keys(data.profiles).forEach((profileId) => {
                    if (data.profiles[profileId].current) {
                        profile = profileId
                    }
                })

                let missingTalis = data.profiles[profile].data.missingTalismans

                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (args[1] === player ? "You are" : args[1] + " is") + " missing " + missingTalis.missing.length + " talismans (" + missingTalis.upgrades.length + " upgrades)!"))
                    if (missingTalis.missing.length > 0) commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Talismans: (" + missingTalis.missing.slice(0, 5).map(talis => talis.display_name).join(" | ") + (missingTalis.missing.length > 5 ? " | and " + (missingTalis.missing.length - 5) + " more" : "") + ")"))
                    if (missingTalis.upgrades.length > 0) commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Upgrades: (" + missingTalis.upgrades.slice(0, 5).map(talis => talis.display_name).join(" | ") + (missingTalis.upgrades.length > 5 ? " | and " + (missingTalis.upgrades.length - 5) + " more" : "") + ")"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + (args[1] === player ? "You are" : args[1] + " is") + " missing " + missingTalis.missing.length + " talismans (" + missingTalis.upgrades.length + " upgrades)!"))
                    if (missingTalis.missing.length > 0) commandQueue.other.push(spamBypass("/gc @" + player + ", Talismans: (" + missingTalis.missing.slice(0, 5).map(talis => talis.display_name).join(" | ") + (missingTalis.missing.length > 5 ? " | and " + (missingTalis.missing.length - 5) + " more" : "") + ")"))
                    if (missingTalis.upgrades.length > 0) commandQueue.other.push(spamBypass("/gc @" + player + ", Upgrades: (" + missingTalis.upgrades.slice(0, 5).map(talis => talis.display_name).join(" | ") + (missingTalis.upgrades.length > 5 ? " | and " + (missingTalis.upgrades.length - 5) + " more" : "") + ")"))
                }
            }
            commandFunctions.ehp = function (player, command, args, reply) {
                if (args.length < 2) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot usage: /ehp [health] [defence]!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", usage: /ehp [health] [defence]!"))
                    }
                    return;
                }
                if (parseFloat[args[1]] > 0 || parseFloat[args[2]] > 0) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot usage: /ehp [health] [defence]!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", usage: /ehp [health] [defence]!"))
                    }
                    return;
                }

                let ehp = numberWithCommas(Math.round(parseFloat(args[1]) * ((parseFloat(args[2]) / 100) + 1)))
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + ehp + " ehp!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + ehp + " ehp!"))
                }
            }
            commandFunctions.commandspamfactor = function (player, command, args, reply) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot the current command spam amount is " + commandsSpeed.toFixed(2) + "!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", the current command spam amount is " + commandsSpeed.toFixed(2) + "!"))
                }
            }
            commandFunctions.talismans = function (player, command, args, reply) {
                let playerScan = player
                if (args[1] !== undefined) {
                    playerScan = args[1]
                }

                let stats1 = JSON.parse(FileLib.getUrlContent("https://api.slothpixel.me/api/players/" + playerScan))
                if (stats1.error === "Player does not exist") {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid player!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", invalid player!"))
                    }
                    return;
                }
                let stats = JSON.parse(FileLib.getUrlContent("https://api.slothpixel.me/api/skyblock/profile/" + playerScan))

                let talisData = {}

                let messageGChat = ""
                let message = []

                try {
                    let uuid = stats1.uuid
                    let playerName = stats1.username

                    let talisData = stats.members[uuid].talisman_bag

                    let totalTalis = 0
                    let totalRecombedTalis = 0

                    talisData.forEach((talis) => {
                        if (talis.attributes === undefined) {
                            return;
                        }
                        totalTalis++
                        totalRecombedTalis += talis.attributes.rarity_upgrades == 1 ? 1 : 0
                    })

                    messageGChat = playerName + " has a total of " + totalTalis + " talismans (" + totalRecombedTalis + " recombed)"
                } catch (err) {
                    console.log(JSON.stringify(err))
                    messageGChat = "There was a error :("
                }

                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + messageGChat))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + messageGChat))
                }

                message.forEach((mess) => {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + mess))
                })
            }
            commandFunctions.skill = function (player, command, args, reply) {
                if (args[1] === undefined || args[2] === undefined) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot requires 2 arguments!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", requires 2 arguments!"))
                    }
                    return;
                }
                let skillReplace = {
                    "dungeon": "dungeoneering",
                    "catacombs": "dungeoneering"
                }
                if (skillReplace[args[1]] !== undefined) {
                    args[1] = skillReplace[args[1]]
                }

                if (skillData.collections[args[1].toUpperCase()] === undefined) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid skill type!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", invalid skill type!"))
                    }
                    return;
                }

                args[2] = parseInt(args[2]) - 1


                if (args[3] !== undefined) {
                    args[3] = parseInt(args[3]) - 1

                    if (skillData.collections[args[1].toUpperCase()].levels[args[3]] === undefined) {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid skill level!"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", invalid skill level!"))
                        }
                        return;
                    }

                    let needExp = 0
                    if (args[2] === -1) {
                        needExp = addNotation("oneLetters", skillData.collections[args[1].toUpperCase()].levels[args[3]].totalExpRequired)
                    } else {

                        if (skillData.collections[args[1].toUpperCase()].levels[args[2]] === undefined) {
                            if (commandsSpeed > commandsSpeedLimit) {
                                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid skill level!"))
                            } else {
                                commandQueue.other.push(spamBypass("/gc @" + player + ", invalid skill level!"))
                            }
                            return;
                        }
                        needExp = addNotation("oneLetters", skillData.collections[args[1].toUpperCase()].levels[args[3]].totalExpRequired - skillData.collections[args[1].toUpperCase()].levels[args[2]].totalExpRequired)
                    }


                    let expinfo = "it takes " + needExp + " exp to go from " + firstLetterCapital(args[1].toLowerCase()) + " " + (args[2] + 1) + " -> " + (args[3] + 1)
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + expinfo))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + expinfo))
                    }
                    return;
                }
                if (skillData.collections[args[1].toUpperCase()].levels[args[2]] === undefined) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid skill level!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", invalid skill level!"))
                    }
                    return;
                }

                if (commandsSpeed > commandsSpeedLimit) {

                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", dming u the results :)"))
                }

                Thread.sleep(500)

                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + firstLetterCapital(args[1].toLowerCase()) + " " + (args[2] + 1) + " (" + addNotation("oneLetters", skillData.collections[args[1].toUpperCase()].levels[args[2]].totalExpRequired) + " exp)"))
                skillData.collections[args[1].toUpperCase()].levels[args[2]].unlocks.forEach((unlock) => {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + unlock))
                })
            }
            commandFunctions.whatstone = function (player, command, args, reply) {
                if (args[1] === undefined) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot you need to specify what reforge!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", you need to specify what reforge!"))
                    }
                    return;
                }

                if (reforgeToStone[firstLetterCapital(args[1])] === undefined) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid reforge!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", invalid reforge!"))
                    }
                    return;
                }


                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + firstLetterCapital(args[1]) + " is from " + reforgeToStone[firstLetterCapital(args[1])].name + "!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + firstLetterCapital(args[1]) + " is from " + reforgeToStone[firstLetterCapital(args[1])].name + "!"))
                }
            }
            commandFunctions.amibetterthanagentlai = function (player, command, args, reply) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (player.length % 2 === 0 ? "yes" : "no") + "."))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + (player.length % 2 === 0 ? "yes" : "no") + "."))
                }
            }
            commandFunctions.amiworsethanagentlai = function (player, command, args, reply) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (player.length % 2 === 0 ? "no" : "yes") + "."))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + (player.length % 2 === 0 ? "no" : "yes") + "."))
                }
            }
            // commandFunctions.getbot = function(player, command, args, reply) {

            //     let bot = []
            //     let leftBots = fragrunbots
            //     for(let i = 0;i<Math.min(10,parseInt(args[1] || "1"));i++){
            //         if(leftBots.length === 0){
            //             break;
            //         }
            //         let rBot = leftBots[Math.floor(Math.random()*leftBots.length)]
            //         bot.push(rBot)
            //         leftBots = leftBots.filter(a=>a!==rBot)
            //     }
            //     if(bot.length > 0){
            //         if (commandsSpeed > commandsSpeedLimit) {
            //             commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Random frag bot" + (bot.length>1?"s are ":" is ") + bot.join(", ") + "!"))
            //         } else {
            //             commandQueue.other.push(spamBypass("/gc @" + player + ", Random frag bot" + (bot.length>1?"s are ":" is ") + bot.join(", ") + "!"))
            //         }
            //     }else{
            //         if (commandsSpeed > commandsSpeedLimit) {
            //             commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot There are no online fragbots!"))
            //         } else {
            //             commandQueue.other.push(spamBypass("/gc @" + player + ", There are no online fragbots!"))
            //         }
            //     }
            // }
            let lbpos_argsReplace = {
                "weight": "weight",
                "skill_weight": "skill_weight",
                "slayer_weight": "slayer_weight",
                "dungeon_weight": "dungeon_weight",
                "average_skill": "average_skill",
                "average_skill_progress": "average_skill_progress",
                "catacomb": "catacomb",
                "catacomb_xp": "catacomb_xp",
                "secrets_found": "secrets_found",
                "healer": "healer",
                "healer_xp": "healer_xp",
                "mage": "mage",
                "mage_xp": "mage_xp",
                "berserk": "berserk",
                "berserk_xp": "berserk_xp",
                "archer": "archer",
                "archer_xp": "archer_xp",
                "tank": "tank",
                "tank_xp": "tank_xp",
                "total_slayer": "total_slayer",
                "revenant_xp": "revenant_xp",
                "tarantula_xp": "tarantula_xp",
                "sven_xp": "sven_xp",
                "enderman_xp": "enderman_xp",
                "mining": "mining",
                "mining_xp": "mining_xp",
                "foraging": "foraging",
                "foraging_xp": "foraging_xp",
                "enchanting": "enchanting",
                "enchanting_xp": "enchanting_xp",
                "farming": "farming",
                "farming_xp": "farming_xp",
                "combat": "combat",
                "combat_xp": "combat_xp",
                "fishing": "fishing",
                "fishing_xp": "fishing_xp",
                "alchemy": "alchemy",
                "alchemy_xp": "alchemy_xp",
                "taming": "taming",
                "taming_xp": "taming_xp",
                "carpentry": "carpentry",
                "carpentry_xp": "carpentry_xp",
                "runecrafting": "runecrafting",
                "runecrafting_xp": "runecrafting_xp",
                "raw_weight/total": "raw_weight/total",
                "raw_weight/weight": "raw_weight/weight",
                "raw_weight/overflow": "raw_weight/overflow",
                "raw_weight/skills/total/weight": "raw_weight/skills/total/weight",
                "raw_weight/skills/total/overflow": "raw_weight/skills/total/overflow",
                "raw_weight/skills/mining/weight": "raw_weight/skills/mining/weight",
                "raw_weight/skills/mining/overflow": "raw_weight/skills/mining/overflow",
                "raw_weight/skills/foraging/weight": "raw_weight/skills/foraging/weight",
                "raw_weight/skills/foraging/overflow": "raw_weight/skills/foraging/overflow",
                "raw_weight/skills/enchanting/weight": "raw_weight/skills/enchanting/weight",
                "raw_weight/skills/enchanting/overflow": "raw_weight/skills/enchanting/overflow",
                "raw_weight/skills/farming/weight": "raw_weight/skills/farming/weight",
                "raw_weight/skills/farming/overflow": "raw_weight/skills/farming/overflow",
                "raw_weight/skills/combat/weight": "raw_weight/skills/combat/weight",
                "raw_weight/skills/combat/overflow": "raw_weight/skills/combat/overflow",
                "raw_weight/skills/fishing/weight": "raw_weight/skills/fishing/weight",
                "raw_weight/skills/fishing/overflow": "raw_weight/skills/fishing/overflow",
                "raw_weight/skills/alchemy/weight": "raw_weight/skills/alchemy/weight",
                "raw_weight/skills/alchemy/overflow": "raw_weight/skills/alchemy/overflow",
                "raw_weight/skills/taming/weight": "raw_weight/skills/taming/weight",
                "raw_weight/skills/taming/overflow": "raw_weight/skills/taming/overflow",
                "raw_weight/slayers/total/weight": "raw_weight/slayers/total/weight",
                "raw_weight/slayers/total/overflow": "raw_weight/slayers/total/overflow",
                "raw_weight/slayers/revenant/weight": "raw_weight/slayers/revenant/weight",
                "raw_weight/slayers/revenant/overflow": "raw_weight/slayers/revenant/overflow",
                "raw_weight/slayers/tarantula/weight": "raw_weight/slayers/tarantula/weight",
                "raw_weight/slayers/tarantula/overflow": "raw_weight/slayers/tarantula/overflow",
                "raw_weight/slayers/sven/weight": "raw_weight/slayers/sven/weight",
                "raw_weight/slayers/sven/overflow": "raw_weight/slayers/sven/overflow",
                "raw_weight/slayers/enderman/weight": "raw_weight/slayers/enderman/weight",
                "raw_weight/slayers/enderman/overflow": "raw_weight/slayers/enderman/overflow",
                "raw_weight/dungeons/total/weight": "raw_weight/dungeons/total/weight",
                "raw_weight/dungeons/total/overflow": "raw_weight/dungeons/total/overflow",
                "raw_weight/dungeons/catacomb/weight": "raw_weight/dungeons/catacomb/weight",
                "raw_weight/dungeons/catacomb/overflow": "raw_weight/dungeons/catacomb/overflow",
                "raw_weight/dungeons/healer/weight": "raw_weight/dungeons/healer/weight",
                "raw_weight/dungeons/healer/overflow": "raw_weight/dungeons/healer/overflow",
                "raw_weight/dungeons/mage/weight": "raw_weight/dungeons/mage/weight",
                "raw_weight/dungeons/mage/overflow": "raw_weight/dungeons/mage/overflow",
                "raw_weight/dungeons/berserk/weight": "raw_weight/dungeons/berserk/weight",
                "raw_weight/dungeons/berserk/overflow": "raw_weight/dungeons/berserk/overflow",
                "raw_weight/dungeons/archer/weight": "raw_weight/dungeons/archer/weight",
                "raw_weight/dungeons/archer/overflow": "raw_weight/dungeons/archer/overflow",
                "raw_weight/dungeons/tank/weight": "raw_weight/dungeons/tank/weight",
                "raw_weight/dungeons/tank/overflow": "raw_weight/dungeons/tank/overflow"
            }
            commandFunctions.lbpos = function (player, command, args, reply) {
                args.shift()
                if (args[0] === undefined) {
                    args[0] = "weight"
                }
                if (args[1] === undefined) {
                    args[1] = player
                }

                // gen args replace

                /*
    function doThing(obj, yes){
        let ret1 = []
    
    
        Object.keys(obj).forEach((key)=>{
            if(typeof(obj[key]) === "object"){
                ret1.push(...doThing(obj[key],true))
            }
            if(typeof(obj[key]) === "number"){
                ret1.push(key)
            }
        })
        if(yes){return ret1}
    
        let ret = {}
    
        ret1.forEach(a=>ret[a] = a)
        return ret;
    }
                */

                args[0] = lbpos_argsReplace[args[0].toLowerCase()] || "weight"

                function getThing(obj, path) {
                    path = path.split("/")
                    path.forEach((a) => {
                        obj = obj[a]
                    })
                    return obj
                }

                let players = senitherData.data.sort((a, b) => { return getThing(b, args[0]) - getThing(a, args[0]) })
                if (args[2] === "excludestaff") {
                    players = players.filter(p => {
                        let rank = guildData.members.filter(f => {
                            return f.playerInfo.uuid === p.uuid.replace(/-/g, "")
                        })[0]?.guildInfo?.rank || "notinguildpepega";
                        return rank === "Member" || rank === "Elite" || rank === "Skyblock King" || rank === "Skyblock God"
                    })
                }

                let done = false
                players.forEach((p, i) => {
                    if (p.username.toLowerCase() === args[1].toLowerCase() || (i + 1).toString() === args[1]) {
                        done = true
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (p.username.toLowerCase() === player.toLowerCase() ? "You are" : p.username + " is") + " #" + (i + 1) + " on the " + args[0] + " lb! (" + numberWithCommas(getThing(p, args[0])) + ")"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", " + (p.username.toLowerCase() === player.toLowerCase() ? "You are" : p.username + " is") + " #" + (i + 1) + " on the " + args[0] + " lb! (" + numberWithCommas(getThing(p, args[0])) + ")"))
                        }
                    }
                })

                if (!done) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot could not find \"" + args[1] + "\" on the lb. if you are new to the guild wait for up to 1 day for it to update!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", could not find \"" + args[1] + "\" on the lb. if you are new to the guild wait for up to 1 day for it to update!"))
                    }
                }
            }




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

            function addNotation(type, value) {
                let returnVal = value;
                let notList = [];
                if (type === "shortScale") {
                    //notation type
                    //do notation stuff here
                    notList = [
                        " Thousand",
                        " Million",
                        " Billion",
                        " Trillion",
                        " Quadrillion",
                        " Quintillion"
                    ];
                }

                if (type === "oneLetters") {
                    notList = [" K", " M", " B", " T"];
                }

                let checkNum = 1000;

                if (type !== "none" && type !== "commas") {
                    let notValue = notList[notList.length - 1];
                    for (let u = notList.length; u >= 1; u--) {
                        notValue = notList.shift();
                        for (let o = 3; o >= 1; o--) {
                            if (value >= checkNum) {
                                returnVal = value / (checkNum / 100);
                                returnVal = Math.floor(returnVal);
                                returnVal = (returnVal / Math.pow(10, o)) * 10;
                                returnVal = +returnVal.toFixed(o - 1) + notValue;
                            }
                            checkNum *= 10;
                        }
                    }
                } else {
                    returnVal = numberWithCommas(value.toFixed(0));
                }

                return returnVal;
            }

            function numberWithCommas(x) {
                if (x === undefined) { return "" }
                var parts = x.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return parts.join(".");
            }

            var sha256 = function a(b) {
                function c(a, b) { return a >>> b | a << 32 - b }
                for (var d, e, f = Math.pow, g = f(2, 32), h = "length", i = "", j = [], k = 8 * b[h], l = a.h = a.h || [], m = a.k = a.k || [], n = m[h], o = {}, p = 2; 64 > n; p++)
                    if (!o[p]) {
                        for (d = 0; 313 > d; d += p) o[d] = p;
                        l[n] = f(p, .5) * g | 0, m[n++] = f(p, 1 / 3) * g | 0
                    }
                for (b += "\x80"; b[h] % 64 - 56;) b += "\x00";
                for (d = 0; d < b[h]; d++) {
                    if (e = b.charCodeAt(d), e >> 8) return;
                    j[d >> 2] |= e << (3 - d) % 4 * 8
                }
                for (j[j[h]] = k / g | 0, j[j[h]] = k, e = 0; e < j[h];) {
                    var q = j.slice(e, e += 16),
                        r = l;
                    for (l = l.slice(0, 8), d = 0; 64 > d; d++) {
                        var s = q[d - 15],
                            t = q[d - 2],
                            u = l[0],
                            v = l[4],
                            w = l[7] + (c(v, 6) ^ c(v, 11) ^ c(v, 25)) + (v & l[5] ^ ~v & l[6]) + m[d] + (q[d] = 16 > d ? q[d] : q[d - 16] + (c(s, 7) ^ c(s, 18) ^ s >>> 3) + q[d - 7] + (c(t, 17) ^ c(t, 19) ^ t >>> 10) | 0),
                            x = (c(u, 2) ^ c(u, 13) ^ c(u, 22)) + (u & l[1] ^ u & l[2] ^ l[1] & l[2]);
                        l = [w + x | 0].concat(l), l[4] = l[4] + w | 0
                    }
                    for (d = 0; 8 > d; d++) l[d] = l[d] + r[d] | 0
                }
                for (d = 0; 8 > d; d++)
                    for (e = 3; e + 1; e--) {
                        var y = l[d] >> 8 * e & 255;
                        i += (16 > y ? 0 : "") + y.toString(16)
                    }
                return i
            };


            var timeSince = function (date) {
                if (typeof date !== 'object') {
                    date = new Date(date);
                }

                var seconds = Math.floor((new Date() - date) / 1000);
                var intervalType;

                var interval = Math.floor(seconds / 31536000);
                if (interval >= 1) {
                    intervalType = 'year';
                } else {
                    interval = Math.floor(seconds / 2592000);
                    if (interval >= 1) {
                        intervalType = 'month';
                    } else {
                        interval = Math.floor(seconds / 86400);
                        if (interval >= 1) {
                            intervalType = 'day';
                        } else {
                            interval = Math.floor(seconds / 3600);
                            if (interval >= 1) {
                                intervalType = "hour";
                            } else {
                                interval = Math.floor(seconds / 60);
                                if (interval >= 1) {
                                    intervalType = "minute";
                                } else {
                                    interval = seconds;
                                    intervalType = "second";
                                }
                            }
                        }
                    }
                }

                if (interval > 1 || interval === 0) {
                    intervalType += 's';
                }

                return interval + ' ' + intervalType;
            };

            function getLevelByXp(xp, type, levelCap) {
                let xp_table =
                    type == 1
                        ? someData.runecrafting_xp
                        : type == 2
                            ? someData.dungeoneering_xp
                            : someData.leveling_xp;

                if (isNaN(xp)) {
                    return {
                        xp: 0,
                        level: 0,
                        xpCurrent: 0,
                        xpForNext: xp_table[1],
                        progress: 0,
                    };
                }

                let xpTotal = 0;
                let level = 0;

                let xpForNext = Infinity;

                let maxLevel = Math.min(levelCap, Object.keys(xp_table)
                    .sort((a, b) => Number(a) - Number(b))
                    .map((a) => Number(a))
                    .pop())

                for (let x = 1; x <= maxLevel; x++) {
                    xpTotal += xp_table[x];

                    if (xpTotal > xp) {
                        xpTotal -= xp_table[x];
                        break;
                    } else {
                        level = x;
                    }
                }

                let xpCurrent = Math.floor(xp - xpTotal);

                if (level < maxLevel) xpForNext = Math.ceil(xp_table[level + 1]);

                let progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));

                return {
                    xp,
                    level,
                    maxLevel,
                    xpCurrent,
                    xpForNext,
                    progress,
                };
            }
            let skillLevelCaps = {
                "experience_skill_combat": 60,
                "experience_skill_foraging": 50,
                "experience_skill_farming": 60,
                "experience_skill_fishing": 50,
                "experience_skill_alchemy": 50,
                "experience_skill_enchanting": 60,
                "experience_skill_mining": 60,
                "experience_skill_taming": 50,
            }
            let someData = {
                leveling_xp: {
                    1: 50,
                    2: 125,
                    3: 200,
                    4: 300,
                    5: 500,
                    6: 750,
                    7: 1000,
                    8: 1500,
                    9: 2000,
                    10: 3500,
                    11: 5000,
                    12: 7500,
                    13: 10000,
                    14: 15000,
                    15: 20000,
                    16: 30000,
                    17: 50000,
                    18: 75000,
                    19: 100000,
                    20: 200000,
                    21: 300000,
                    22: 400000,
                    23: 500000,
                    24: 600000,
                    25: 700000,
                    26: 800000,
                    27: 900000,
                    28: 1000000,
                    29: 1100000,
                    30: 1200000,
                    31: 1300000,
                    32: 1400000,
                    33: 1500000,
                    34: 1600000,
                    35: 1700000,
                    36: 1800000,
                    37: 1900000,
                    38: 2000000,
                    39: 2100000,
                    40: 2200000,
                    41: 2300000,
                    42: 2400000,
                    43: 2500000,
                    44: 2600000,
                    45: 2750000,
                    46: 2900000,
                    47: 3100000,
                    48: 3400000,
                    49: 3700000,
                    50: 4000000,
                    51: 4300000,
                    52: 4600000,
                    53: 4900000,
                    54: 5200000,
                    55: 5500000,
                    56: 5800000,
                    57: 6100000,
                    58: 6400000,
                    59: 6700000,
                    60: 7000000
                },

                // XP required for each level of Runecrafting
                runecrafting_xp: {
                    1: 50,
                    2: 100,
                    3: 125,
                    4: 160,
                    5: 200,
                    6: 250,
                    7: 315,
                    8: 400,
                    9: 500,
                    10: 625,
                    11: 785,
                    12: 1000,
                    13: 1250,
                    14: 1600,
                    15: 2000,
                    16: 2465,
                    17: 3125,
                    18: 4000,
                    19: 5000,
                    20: 6200,
                    21: 7800,
                    22: 9800,
                    23: 12200,
                    24: 15300,
                    25: 19050
                },

                dungeoneering_xp: {
                    1: 50,
                    2: 75,
                    3: 110,
                    4: 160,
                    5: 230,
                    6: 330,
                    7: 470,
                    8: 670,
                    9: 950,
                    10: 1340,
                    11: 1890,
                    12: 2665,
                    13: 3760,
                    14: 5260,
                    15: 7380,
                    16: 10300,
                    17: 14400,
                    18: 20000,
                    19: 27600,
                    20: 38000,
                    21: 52500,
                    22: 71500,
                    23: 97000,
                    24: 132000,
                    25: 180000,
                    26: 243000,
                    27: 328000,
                    28: 445000,
                    29: 600000,
                    30: 800000,
                    31: 1065000,
                    32: 1410000,
                    33: 1900000,
                    34: 2500000,
                    35: 3300000,
                    36: 4300000,
                    37: 5600000,
                    38: 7200000,
                    39: 9200000,
                    40: 12000000,
                    41: 15000000,
                    42: 19000000,
                    43: 24000000,
                    44: 30000000,
                    45: 38000000,
                    46: 48000000,
                    47: 60000000,
                    48: 75000000,
                    49: 93000000,
                    50: 116250000
                },

                guild_xp: [
                    100000,
                    150000,
                    250000,
                    500000,
                    750000,
                    1000000,
                    1250000,
                    1500000,
                    2000000,
                    2500000,
                    2500000,
                    2500000,
                    2500000,
                    2500000,
                    3000000
                ],

                // total XP required for level of Slayer
                slayer_xp: {
                    zombie: {
                        1: 5,
                        2: 15,
                        3: 200,
                        4: 1000,
                        5: 5000,
                        6: 20000,
                        7: 100000,
                        8: 400000,
                        9: 1000000
                    },
                    spider: {
                        1: 5,
                        2: 15,
                        3: 200,
                        4: 1000,
                        5: 5000,
                        6: 20000,
                        7: 100000,
                        8: 400000,
                        9: 1000000
                    },
                    wolf: {
                        1: 5,
                        2: 15,
                        3: 200,
                        4: 1500,
                        5: 5000,
                        6: 20000,
                        7: 100000,
                        8: 400000,
                        9: 1000000
                    }
                },

                slayer_boss_xp: {
                    1: 5,
                    2: 25,
                    3: 100,
                    4: 500
                }
            };

            function firstLetterCapital(string) {
                return string.substr(0, 1).toUpperCase() + string.substr(1)
            }

            function firstLetterWordCapital(string) {
                let retString = ""
                string.split(" ").forEach((str) => { retString += " " + firstLetterCapital(str) })
                return retString.substr(1);
            }

            let tierBoostChange = {
                "COMMON": "UNCOMMON",
                "UNCOMMON": "RARE",
                "RARE": "EPIC",
                "EPIC": "LEGENDARY",
                "LEGENDARY": "LEGENDARY"
            }

            function getPetLevel(pet) {
                const rarityOffset = constants.pet_rarity_offset[pet.tier.toLowerCase()];
                const levels = constants.pet_levels.slice(rarityOffset, rarityOffset + 99);

                const xpMaxLevel = levels.reduce((a, b) => a + b, 0)
                let xpTotal = 0;
                let level = 1;

                let xpForNext;

                for (let i = 0; i < 100; i++) {
                    xpTotal += levels[i];

                    if (xpTotal > pet.exp) {
                        xpTotal -= levels[i];
                        break;
                    } else {
                        level++;
                    }
                }

                let xpCurrent = Math.floor(pet.exp - xpTotal);
                let progress;

                if (level < 100) {
                    xpForNext = Math.ceil(levels[level - 1]);
                    progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));
                } else {
                    level = 100;
                    xpCurrent = pet.exp - levels[99];
                    xpForNext = 0;
                    progress = 1;
                }

                return {
                    level,
                    xpCurrent,
                    xpForNext,
                    progress,
                    xpMaxLevel
                };
            }

            let constants = {
                pet_rarity_offset: {
                    common: 0,
                    uncommon: 6,
                    rare: 11,
                    epic: 16,
                    legendary: 20
                },

                pet_levels: [
                    100,
                    110,
                    120,
                    130,
                    145,
                    160,
                    175,
                    190,
                    210,
                    230,
                    250,
                    275,
                    300,
                    330,
                    360,
                    400,
                    440,
                    490,
                    540,
                    600,
                    660,
                    730,
                    800,
                    880,
                    960,
                    1050,
                    1150,
                    1260,
                    1380,
                    1510,
                    1650,
                    1800,
                    1960,
                    2130,
                    2310,
                    2500,
                    2700,
                    2920,
                    3160,
                    3420,
                    3700,
                    4000,
                    4350,
                    4750,
                    5200,
                    5700,
                    6300,
                    7000,
                    7800,
                    8700,
                    9700,
                    10800,
                    12000,
                    13300,
                    14700,
                    16200,
                    17800,
                    19500,
                    21300,
                    23200,
                    25200,
                    27400,
                    29800,
                    32400,
                    35200,
                    38200,
                    41400,
                    44800,
                    48400,
                    52200,
                    56200,
                    60400,
                    64800,
                    69400,
                    74200,
                    79200,
                    84700,
                    90700,
                    97200,
                    104200,
                    111700,
                    119700,
                    128200,
                    137200,
                    146700,
                    156700,
                    167700,
                    179700,
                    192700,
                    206700,
                    221700,
                    237700,
                    254700,
                    272700,
                    291700,
                    311700,
                    333700,
                    357700,
                    383700,
                    411700,
                    441700,
                    476700,
                    516700,
                    561700,
                    611700,
                    666700,
                    726700,
                    791700,
                    861700,
                    936700,
                    1016700,
                    1101700,
                    1191700,
                    1286700,
                    1386700,
                    1496700,
                    1616700,
                    1746700,
                    1886700
                ],

                pet_levels_accum: [
                    100,
                    110,
                    120,
                    130,
                    145,
                    160,
                    175,
                    190,
                    210,
                    230,
                    250,
                    275,
                    300,
                    330,
                    360,
                    400,
                    440,
                    490,
                    540,
                    600,
                    660,
                    730,
                    800,
                    880,
                    960,
                    1050,
                    1150,
                    1260,
                    1380,
                    1510,
                    1650,
                    1800,
                    1960,
                    2130,
                    2310,
                    2500,
                    2700,
                    2920,
                    3160,
                    3420,
                    3700,
                    4000,
                    4350,
                    4750,
                    5200,
                    5700,
                    6300,
                    7000,
                    7800,
                    8700,
                    9700,
                    10800,
                    12000,
                    13300,
                    14700,
                    16200,
                    17800,
                    19500,
                    21300,
                    23200,
                    25200,
                    27400,
                    29800,
                    32400,
                    35200,
                    38200,
                    41400,
                    44800,
                    48400,
                    52200,
                    56200,
                    60400,
                    64800,
                    69400,
                    74200,
                    79200,
                    84700,
                    90700,
                    97200,
                    104200,
                    111700,
                    119700,
                    128200,
                    137200,
                    146700,
                    156700,
                    167700,
                    179700,
                    192700,
                    206700,
                    221700,
                    237700,
                    254700,
                    272700,
                    291700,
                    311700,
                    333700,
                    357700,
                    383700,
                    411700,
                    441700,
                    476700,
                    516700,
                    561700,
                    611700,
                    666700,
                    726700,
                    791700,
                    861700,
                    936700,
                    1016700,
                    1101700,
                    1191700,
                    1286700,
                    1386700,
                    1496700,
                    1616700,
                    1746700,
                    1886700
                ],

                pet_data: {
                    "BAT": {
                        head: "/head/382fc3f71b41769376a9e92fe3adbaac3772b999b219c9d6b4680ba9983e527",
                        type: "mining",
                        emoji: "🦇"
                    },
                    "BLAZE": {
                        head: "/head/b78ef2e4cf2c41a2d14bfde9caff10219f5b1bf5b35a49eb51c6467882cb5f0",
                        type: "combat",
                        emoji: "🔥"
                    },
                    "CHICKEN": {
                        head: "/head/7f37d524c3eed171ce149887ea1dee4ed399904727d521865688ece3bac75e",
                        type: "farming",
                        emoji: "🐔"
                    },
                    "HORSE": {
                        head: "/head/36fcd3ec3bc84bafb4123ea479471f9d2f42d8fb9c5f11cf5f4e0d93226",
                        type: "combat",
                        emoji: "🐴"
                    },
                    "JERRY": {
                        head: "/head/822d8e751c8f2fd4c8942c44bdb2f5ca4d8ae8e575ed3eb34c18a86e93b",
                        type: "combat",
                        emoji: "🧑"
                    },
                    "OCELOT": {
                        head: "/head/5657cd5c2989ff97570fec4ddcdc6926a68a3393250c1be1f0b114a1db1",
                        type: "foraging",
                        emoji: "🐈"
                    },
                    "PIGMAN": {
                        head: "/head/63d9cb6513f2072e5d4e426d70a5557bc398554c880d4e7b7ec8ef4945eb02f2",
                        type: "combat",
                        emoji: "🐷"
                    },
                    "RABBIT": {
                        head: "/head/117bffc1972acd7f3b4a8f43b5b6c7534695b8fd62677e0306b2831574b",
                        type: "farming",
                        emoji: "🐇"
                    },
                    "SHEEP": {
                        head: "/head/64e22a46047d272e89a1cfa13e9734b7e12827e235c2012c1a95962874da0",
                        type: "alchemy",
                        emoji: "🐑"
                    },
                    "SILVERFISH": {
                        head: "/head/da91dab8391af5fda54acd2c0b18fbd819b865e1a8f1d623813fa761e924540",
                        type: "mining",
                        emoji: "🐛"
                    },
                    "WITHER_SKELETON": {
                        head: "/head/f5ec964645a8efac76be2f160d7c9956362f32b6517390c59c3085034f050cff",
                        type: "mining",
                        emoji: "💀"
                    },
                    "SKELETON_HORSE": {
                        head: "/head/47effce35132c86ff72bcae77dfbb1d22587e94df3cbc2570ed17cf8973a",
                        type: "combat",
                        emoji: "🐴"
                    },
                    "WOLF": {
                        head: "/head/dc3dd984bb659849bd52994046964c22725f717e986b12d548fd169367d494",
                        type: "combat",
                        emoji: "🐺"
                    },
                    "ENDERMAN": {
                        head: "/head/6eab75eaa5c9f2c43a0d23cfdce35f4df632e9815001850377385f7b2f039ce1",
                        type: "combat",
                        emoji: "🔮"
                    },
                    "PHOENIX": {
                        head: "/head/23aaf7b1a778949696cb99d4f04ad1aa518ceee256c72e5ed65bfa5c2d88d9e",
                        type: "combat",
                        emoji: "🐦"
                    },
                    "MAGMA_CUBE": {
                        head: "/head/38957d5023c937c4c41aa2412d43410bda23cf79a9f6ab36b76fef2d7c429",
                        type: "combat",
                        emoji: "🌋"
                    },
                    "FLYING_FISH": {
                        head: "/head/40cd71fbbbbb66c7baf7881f415c64fa84f6504958a57ccdb8589252647ea",
                        type: "fishing",
                        emoji: "🐟"
                    },
                    "BLUE_WHALE": {
                        head: "/head/dab779bbccc849f88273d844e8ca2f3a67a1699cb216c0a11b44326ce2cc20",
                        type: "fishing",
                        emoji: "🐋"
                    },
                    "TIGER": {
                        head: "/head/fc42638744922b5fcf62cd9bf27eeab91b2e72d6c70e86cc5aa3883993e9d84",
                        type: "combat",
                        emoji: "🐯"
                    },
                    "LION": {
                        head: "/head/38ff473bd52b4db2c06f1ac87fe1367bce7574fac330ffac7956229f82efba1",
                        type: "foraging",
                        emoji: "🦁"
                    },
                    "PARROT": {
                        head: "/head/5df4b3401a4d06ad66ac8b5c4d189618ae617f9c143071c8ac39a563cf4e4208",
                        type: "alchemy",
                        emoji: "🦜"
                    },
                    "SNOWMAN": {
                        head: "/head/11136616d8c4a87a54ce78a97b551610c2b2c8f6d410bc38b858f974b113b208",
                        type: "combat",
                        emoji: "⛄"
                    },
                    "TURTLE": {
                        head: "/head/212b58c841b394863dbcc54de1c2ad2648af8f03e648988c1f9cef0bc20ee23c",
                        type: "combat",
                        emoji: "🐢"
                    },
                    "BEE": {
                        head: "/head/7e941987e825a24ea7baafab9819344b6c247c75c54a691987cd296bc163c263",
                        type: "farming",
                        emoji: "🐝"
                    },
                    "ENDER_DRAGON": {
                        head: "/head/aec3ff563290b13ff3bcc36898af7eaa988b6cc18dc254147f58374afe9b21b9",
                        type: "combat",
                        emoji: "🐲"
                    },
                    "GUARDIAN": {
                        head: "/head/221025434045bda7025b3e514b316a4b770c6faa4ba9adb4be3809526db77f9d",
                        type: "combat",
                        emoji: "🐡"
                    },
                    "SQUID": {
                        head: "/head/01433be242366af126da434b8735df1eb5b3cb2cede39145974e9c483607bac",
                        type: "fishing",
                        emoji: "🦑"
                    },
                    "GIRAFFE": {
                        head: "/head/176b4e390f2ecdb8a78dc611789ca0af1e7e09229319c3a7aa8209b63b9",
                        type: "foraging",
                        emoji: "🦒"
                    },
                    "ELEPHANT": {
                        head: "/head/7071a76f669db5ed6d32b48bb2dba55d5317d7f45225cb3267ec435cfa514",
                        type: "farming",
                        emoji: "🐘"
                    },
                    "MONKEY": {
                        head: "/head/13cf8db84807c471d7c6922302261ac1b5a179f96d1191156ecf3e1b1d3ca",
                        type: "foraging",
                        emoji: "🐒"
                    },
                    "SPIDER": {
                        head: "/head/cd541541daaff50896cd258bdbdd4cf80c3ba816735726078bfe393927e57f1",
                        type: "combat",
                        emoji: "🕷️"
                    },
                    "ENDERMITE": {
                        head: "/head/5a1a0831aa03afb4212adcbb24e5dfaa7f476a1173fce259ef75a85855",
                        type: "mining",
                        emoji: "🐛"
                    },
                    "GHOUL": {
                        head: "/head/87934565bf522f6f4726cdfe127137be11d37c310db34d8c70253392b5ff5b",
                        type: "combat",
                        emoji: "🧟"
                    },
                    "JELLYFISH": {
                        head: "/head/913f086ccb56323f238ba3489ff2a1a34c0fdceeafc483acff0e5488cfd6c2f1",
                        type: "alchemy",
                        emoji: "🎐"
                    },
                    "PIG": {
                        head: "/head/621668ef7cb79dd9c22ce3d1f3f4cb6e2559893b6df4a469514e667c16aa4",
                        type: "farming",
                        emoji: "🐷"
                    },
                    "ROCK": {
                        head: "/head/cb2b5d48e57577563aca31735519cb622219bc058b1f34648b67b8e71bc0fa",
                        type: "mining",
                        emoji: "🗿"
                    },
                    "SKELETON": {
                        head: "/head/fca445749251bdd898fb83f667844e38a1dff79a1529f79a42447a0599310ea4",
                        type: "combat",
                        emoji: "💀"
                    },
                    "ZOMBIE": {
                        head: "/head/56fc854bb84cf4b7697297973e02b79bc10698460b51a639c60e5e417734e11",
                        type: "combat",
                        emoji: "🧟"
                    },
                    "DOLPHIN": {
                        head: "/head/cefe7d803a45aa2af1993df2544a28df849a762663719bfefc58bf389ab7f5",
                        type: "fishing",
                        emoji: "🐬"
                    },
                    "BABY_YETI": {
                        head: "/head/ab126814fc3fa846dad934c349628a7a1de5b415021a03ef4211d62514d5",
                        type: "fishing",
                        emoji: "❄️"
                    },
                    "GOLEM": {
                        head: "/head/89091d79ea0f59ef7ef94d7bba6e5f17f2f7d4572c44f90f76c4819a714",
                        type: "combat",
                        emoji: "🗿"
                    },
                    "HOUND": {
                        head: "/head/b7c8bef6beb77e29af8627ecdc38d86aa2fea7ccd163dc73c00f9f258f9a1457",
                        type: "combat",
                        emoji: "👹"
                    },
                    "TARANTULA": {
                        head: "/head/8300986ed0a04ea79904f6ae53f49ed3a0ff5b1df62bba622ecbd3777f156df8",
                        type: "combat",
                        emoji: "🕸️"
                    },
                    "BLACK_CAT": {
                        head: "/head/e4b45cbaa19fe3d68c856cd3846c03b5f59de81a480eec921ab4fa3cd81317",
                        type: "combat",
                        emoji: "🐱"
                    },
                    "MEGALODON": {
                        head: null,
                        type: "combat",
                        emoji: "🐬"
                    }
                },

                pet_value: {
                    "common": 1,
                    "uncommon": 2,
                    "rare": 3,
                    "epic": 4,
                    "legendary": 5
                },

                pet_rewards: {
                    0: {
                        magic_find: 0
                    },
                    10: {
                        magic_find: 1
                    },
                    25: {
                        magic_find: 2
                    },
                    50: {
                        magic_find: 3
                    },
                    75: {
                        magic_find: 4
                    },
                    100: {
                        magic_find: 5
                    },
                    130: {
                        magic_find: 6
                    },
                    175: {
                        magic_find: 7
                    }
                },

                pet_items: {
                    PET_ITEM_ALL_SKILLS_BOOST_COMMON: {
                        description: "§7Gives +§a10% §7pet exp for all skills",
                        xpBoost: 0.1,
                        xpBoostType: "all"
                    },
                    PET_ITEM_BIG_TEETH_COMMON: {
                        description: "§7Increases §9Crit Chance §7by §a5%",
                        stats: {
                            crit_chance: 5
                        },
                        xpBoost: 0,
                        xpBoostType: "all"
                    },
                    PET_ITEM_IRON_CLAWS_COMMON: {
                        description: "§7Increases the pet's §9Crit Damage §7by §a40% §7and §9Crit Chance §7by §a40%",
                        xpBoost: 0,
                        xpBoostType: "all"
                    },
                    PET_ITEM_SHARPENED_CLAWS_UNCOMMON: {
                        description: "§7Increases §9Crit Damage §7by §a15%",
                        stats: {
                            crit_damage: 15
                        },
                        xpBoost: 0,
                        xpBoostType: "all"
                    },
                    PET_ITEM_HARDENED_SCALES_UNCOMMON: {
                        description: "§7Increases §aDefense §7by §a25",
                        stats: {
                            defense: 25
                        },
                        xpBoost: 0,
                        xpBoostType: "all"
                    },
                    PET_ITEM_BUBBLEGUM: {
                        description: "§7Your pet fuses its power with placed §aOrbs §7to give them §a2x §7duration",
                        xpBoost: 0,
                        xpBoostType: "all"
                    },
                    PET_ITEM_LUCKY_CLOVER: {
                        description: "§7Increases §bMagic Find §7by §a7",
                        stats: {
                            magic_find: 7
                        },
                        xpBoost: 0,
                        xpBoostType: "all"
                    },
                    PET_ITEM_TEXTBOOK: {
                        description: "§7Increases the pet's §bIntelligence §7by §a100%",
                        xpBoost: 0,
                        xpBoostType: "all"
                    },
                    PET_ITEM_SADDLE: {
                        description: "§7Increase horse speed by §a50% §7 and jump boost by §a100%",
                        xpBoost: 0,
                        xpBoostType: "all"
                    },
                    PET_ITEM_EXP_SHARE: {
                        description: "§7While unequipped this pet gains §a25% §7of the equipped pet's xp, this is §7split between all pets holding the item.",
                        xpBoost: 0,
                        xpBoostType: "all"
                    },
                    PET_ITEM_TIER_BOOST: {
                        description: "§7Boosts the §ararity §7of your pet by 1 tier!",
                        xpBoost: 0,
                        xpBoostType: "all"
                    },
                    PET_ITEM_COMBAT_SKILL_BOOST_COMMON: {
                        description: "§7Gives +§a20% §7pet exp for Combat",
                        xpBoost: 0.2,
                        xpBoostType: "combat"
                    },
                    PET_ITEM_COMBAT_SKILL_BOOST_UNCOMMON: {
                        description: "§7Gives +§a30% §7pet exp for Combat",
                        xpBoost: 0.3,
                        xpBoostType: "combat"
                    },
                    PET_ITEM_COMBAT_SKILL_BOOST_RARE: {
                        description: "§7Gives +§a40% §7pet exp for Combat",
                        xpBoost: 0.4,
                        xpBoostType: "combat"
                    },
                    PET_ITEM_COMBAT_SKILL_BOOST_EPIC: {
                        description: "§7Gives +§a50% §7pet exp for Combat",
                        xpBoost: 0.5,
                        xpBoostType: "combat"
                    },
                    PET_ITEM_FISHING_SKILL_BOOST_COMMON: {
                        description: "§7Gives +§a20% §7pet exp for Fishing",
                        xpBoost: 0.2,
                        xpBoostType: "fishing"
                    },
                    PET_ITEM_FISHING_SKILL_BOOST_UNCOMMON: {
                        description: "§7Gives +§a30% §7pet exp for Fishing",
                        xpBoost: 0.3,
                        xpBoostType: "fishing"
                    },
                    PET_ITEM_FISHING_SKILL_BOOST_RARE: {
                        description: "§7Gives +§a40% §7pet exp for Fishing",
                        xpBoost: 0.4,
                        xpBoostType: "fishing"
                    },
                    PET_ITEM_FISHING_SKILL_BOOST_EPIC: {
                        description: "§7Gives +§a50% §7pet exp for Fishing",
                        xpBoost: 0.5,
                        xpBoostType: "fishing"
                    },
                    PET_ITEM_FORAGING_SKILL_BOOST_COMMON: {
                        description: "§7Gives +§a20% §7pet exp for Foraging",
                        xpBoost: 0.2,
                        xpBoostType: "foraging"
                    },
                    PET_ITEM_FORAGING_SKILL_BOOST_UNCOMMON: {
                        description: "§7Gives +§a30% §7pet exp for Foraging",
                        xpBoost: 0.3,
                        xpBoostType: "foraging"
                    },
                    PET_ITEM_FORAGING_SKILL_BOOST_RARE: {
                        description: "§7Gives +§a40% §7pet exp for Foraging",
                        xpBoost: 0.4,
                        xpBoostType: "foraging"
                    },
                    PET_ITEM_FORAGING_SKILL_BOOST_EPIC: {
                        description: "§7Gives +§a50% §7pet exp for Foraging",
                        xpBoost: 0.5,
                        xpBoostType: "foraging"
                    },
                    PET_ITEM_MINING_SKILL_BOOST_COMMON: {
                        description: "§7Gives +§a20% §7pet exp for Mining",
                        xpBoost: 0.2,
                        xpBoostType: "mining"
                    },
                    PET_ITEM_MINING_SKILL_BOOST_UNCOMMON: {
                        description: "§7Gives +§a30% §7pet exp for Mining",
                        xpBoost: 0.3,
                        xpBoostType: "mining"
                    },
                    PET_ITEM_MINING_SKILL_BOOST_RARE: {
                        description: "§7Gives +§a40% §7pet exp for Mining",
                        xpBoost: 0.4,
                        xpBoostType: "mining"
                    },
                    PET_ITEM_MINING_SKILL_BOOST_EPIC: {
                        description: "§7Gives +§a50% §7pet exp for Mining",
                        xpBoost: 0.5,
                        xpBoostType: "mining"
                    },
                    PET_ITEM_FARMING_SKILL_BOOST_COMMON: {
                        description: "§7Gives +§a20% §7pet exp for Farming",
                        xpBoost: 0.2,
                        xpBoostType: "farming"
                    },
                    PET_ITEM_FARMING_SKILL_BOOST_UNCOMMON: {
                        description: "§7Gives +§a30% §7pet exp for Farming",
                        xpBoost: 0.3,
                        xpBoostType: "farming"
                    },
                    PET_ITEM_FARMING_SKILL_BOOST_RARE: {
                        description: "§7Gives +§a40% §7pet exp for Farming",
                        xpBoost: 0.4,
                        xpBoostType: "farming"
                    },
                    PET_ITEM_FARMING_SKILL_BOOST_EPIC: {
                        description: "§7Gives +§a50% §7pet exp for Farming",
                        xpBoost: 0.5,
                        xpBoostType: "farming"
                    }
                },
                talismans: {
                    talisman_upgrades: {
                        WOLF_TALISMAN: [
                            'WOLF_RING'
                        ],
                        RING_POTION_AFFINITY: [
                            'ARTIFACT_POTION_AFFINITY'
                        ],
                        POTION_AFFINITY_TALISMAN: [
                            'RING_POTION_AFFINITY',
                            'ARTIFACT_POTION_AFFINITY'
                        ],
                        FEATHER_RING: [
                            'FEATHER_ARTIFACT'
                        ],
                        FEATHER_TALISMAN: [
                            'FEATHER_RING',
                            'FEATHER_ARTIFACT'
                        ],
                        SEA_CREATURE_RING: [
                            'SEA_CREATURE_ARTIFACT'
                        ],
                        SEA_CREATURE_TALISMAN: [
                            'SEA_CREATURE_RING',
                            'SEA_CREATURE_ARTIFACT'
                        ],
                        HEALING_TALISMAN: [
                            'HEALING_RING'
                        ],
                        CANDY_ARTIFACT: [
                            'CANDY_RELIC'
                        ],
                        CANDY_RING: [
                            'CANDY_ARTIFACT',
                            'CANDY_RELIC'
                        ],
                        CANDY_TALISMAN: [
                            'CANDY_RING',
                            'CANDY_ARTIFACT',
                            'CANDY_RELIC'
                        ],
                        INTIMIDATION_RING: [
                            'INTIMIDATION_ARTIFACT'
                        ],
                        INTIMIDATION_TALISMAN: [
                            'INTIMIDATION_RING',
                            'INTIMIDATION_ARTIFACT'
                        ],
                        SPIDER_RING: [
                            'SPIDER_ARTIFACT'
                        ],
                        SPIDER_TALISMAN: [
                            'SPIDER_RING',
                            'SPIDER_ARTIFACT'
                        ],
                        RED_CLAW_RING: [
                            'RED_CLAW_ARTIFACT'
                        ],
                        RED_CLAW_TALISMAN: [
                            'RED_CLAW_RING',
                            'RED_CLAW_ARTIFACT'
                        ],
                        HUNTER_TALISMAN: [
                            'HUNTER_RING'
                        ],
                        ZOMBIE_RING: [
                            'ZOMBIE_ARTIFACT'
                        ],
                        ZOMBIE_TALISMAN: [
                            'ZOMBIE_RING',
                            'ZOMBIE_ARTIFACT'
                        ],
                        BAT_RING: [
                            'BAT_ARTIFACT'
                        ],
                        BAT_TALISMAN: [
                            'BAT_RING',
                            'BAT_ARTIFACT'
                        ],
                        BROKEN_PIGGY_BANK: [
                            'CRACKED_PIGGY_BANK',
                            'PIGGY_BANK'
                        ],
                        CRACKED_PIGGY_BANK: [
                            'PIGGY_BANK'
                        ],
                        SPEED_TALISMAN: [
                            'SPEED_RING',
                            'SPEED_ARTIFACT'
                        ],
                        SPEED_RING: [
                            'SPEED_ARTIFACT'
                        ],
                        PERSONAL_COMPACTOR_4000: [
                            'PERSONAL_COMPACTOR_5000',
                            'PERSONAL_COMPACTOR_6000'
                        ],
                        PERSONAL_COMPACTOR_5000: [
                            'PERSONAL_COMPACTOR_6000'
                        ],
                        SCARF_STUDIES: [
                            'SCARF_THESIS',
                            'SCARF_GRIMOIRE'
                        ],
                        SCARF_THESIS: [
                            'SCARF_GRIMOIRE'
                        ],
                        CAT_TALISMAN: [
                            'LYNX_TALISMAN',
                            'CHEETAH_TALISMAN'
                        ],
                        LYNX_TALISMAN: [
                            'CHEETAH_TALISMAN'
                        ],
                        SHADY_RING: [
                            'CROOKED_ARTIFACT',
                            'SEAL_OF_THE_FAMILY'
                        ],
                        CROOKED_ARTIFACT: [
                            'SEAL_OF_THE_FAMILY'
                        ],
                        TREASURE_TALISMAN: [
                            'TREASURE_RING',
                            'TREASURE_ARTIFACT'
                        ],
                        TREASURE_RING: [
                            'TREASURE_ARTIFACT'
                        ],
                        BEASTMASTER_CREST_COMMON: [
                            'BEASTMASTER_CREST_UNCOMMON',
                            'BEASTMASTER_CREST_RARE',
                            'BEASTMASTER_CREST_EPIC',
                            'BEASTMASTER_CREST_LEGENDARY'
                        ],
                        BEASTMASTER_CREST_UNCOMMON: [
                            'BEASTMASTER_CREST_RARE',
                            'BEASTMASTER_CREST_EPIC',
                            'BEASTMASTER_CREST_LEGENDARY'
                        ],
                        BEASTMASTER_CREST_RARE: [
                            'BEASTMASTER_CREST_EPIC',
                            'BEASTMASTER_CREST_LEGENDARY'
                        ],
                        BEASTMASTER_CREST_EPIC: [
                            'BEASTMASTER_CREST_LEGENDARY'
                        ],
                        RAGGEDY_SHARK_TOOTH_NECKLACE: [
                            'DULL_SHARK_TOOTH_NECKLACE',
                            'HONED_SHARK_TOOTH_NECKLACE',
                            'SHARP_SHARK_TOOTH_NECKLACE',
                            'RAZOR_SHARP_SHARK_TOOTH_NECKLACE'
                        ],
                        DULL_SHARK_TOOTH_NECKLACE: [
                            'HONED_SHARK_TOOTH_NECKLACE',
                            'SHARP_SHARK_TOOTH_NECKLACE',
                            'RAZOR_SHARP_SHARK_TOOTH_NECKLACE'
                        ],
                        HONED_SHARK_TOOTH_NECKLACE: [
                            'SHARP_SHARK_TOOTH_NECKLACE',
                            'RAZOR_SHARP_SHARK_TOOTH_NECKLACE'
                        ],
                        SHARP_SHARK_TOOTH_NECKLACE: [
                            'RAZOR_SHARP_SHARK_TOOTH_NECKLACE'
                        ],
                        BAT_PERSON_TALISMAN: [
                            'BAT_PERSON_RING',
                            'BAT_PERSON_ARTIFACT'
                        ],
                        BAT_PERSON_RING: [
                            'BAT_PERSON_ARTIFACT'
                        ],
                        LUCKY_HOOF: [
                            'ETERNAL_HOOF'
                        ],
                        WITHER_ARTIFACT: [
                            'WITHER_RELIC'
                        ],

                        WEDDING_RING_0: [
                            'WEDDING_RING_2',
                            'WEDDING_RING_4',
                            'WEDDING_RING_7',
                            'WEDDING_RING_9'
                        ],
                        WEDDING_RING_2: [
                            'WEDDING_RING_4',
                            'WEDDING_RING_7',
                            'WEDDING_RING_9'
                        ],
                        WEDDING_RING_4: [
                            'WEDDING_RING_7',
                            'WEDDING_RING_9'
                        ],
                        WEDDING_RING_7: [
                            'WEDDING_RING_9'
                        ],

                        CAMPFIRE_TALISMAN_1: [
                            'CAMPFIRE_TALISMAN_4',
                            'CAMPFIRE_TALISMAN_8',
                            'CAMPFIRE_TALISMAN_13',
                            'CAMPFIRE_TALISMAN_21'
                        ],
                        CAMPFIRE_TALISMAN_4: [
                            'CAMPFIRE_TALISMAN_8',
                            'CAMPFIRE_TALISMAN_13',
                            'CAMPFIRE_TALISMAN_21'
                        ],
                        CAMPFIRE_TALISMAN_8: [
                            'CAMPFIRE_TALISMAN_13',
                            'CAMPFIRE_TALISMAN_21'
                        ],
                        CAMPFIRE_TALISMAN_13: [
                            'CAMPFIRE_TALISMAN_21'
                        ]
                    },

                    talisman_duplicates: {
                        WEDDING_RING_0: [
                            'WEDDING_RING_1'
                        ],
                        WEDDING_RING_2: [
                            'WEDDING_RING_3'
                        ],
                        WEDDING_RING_4: [
                            'WEDDING_RING_5',
                            'WEDDING_RING_6'
                        ],
                        WEDDING_RING_7: [
                            'WEDDING_RING_8'
                        ],

                        CAMPFIRE_TALISMAN_1: [
                            'CAMPFIRE_TALISMAN_2',
                            'CAMPFIRE_TALISMAN_3'
                        ],
                        CAMPFIRE_TALISMAN_4: [
                            'CAMPFIRE_TALISMAN_5',
                            'CAMPFIRE_TALISMAN_6',
                            'CAMPFIRE_TALISMAN_7'
                        ],
                        CAMPFIRE_TALISMAN_8: [
                            'CAMPFIRE_TALISMAN_9',
                            'CAMPFIRE_TALISMAN_10',
                            'CAMPFIRE_TALISMAN_11',
                            'CAMPFIRE_TALISMAN_12'
                        ],
                        CAMPFIRE_TALISMAN_13: [
                            'CAMPFIRE_TALISMAN_14',
                            'CAMPFIRE_TALISMAN_15',
                            'CAMPFIRE_TALISMAN_16',
                            'CAMPFIRE_TALISMAN_17',
                            'CAMPFIRE_TALISMAN_18',
                            'CAMPFIRE_TALISMAN_19',
                            'CAMPFIRE_TALISMAN_20'
                        ],
                        CAMPFIRE_TALISMAN_21: [
                            'CAMPFIRE_TALISMAN_22',
                            'CAMPFIRE_TALISMAN_23',
                            'CAMPFIRE_TALISMAN_24',
                            'CAMPFIRE_TALISMAN_25',
                            'CAMPFIRE_TALISMAN_26',
                            'CAMPFIRE_TALISMAN_27',
                            'CAMPFIRE_TALISMAN_28',
                            'CAMPFIRE_TALISMAN_29'
                        ]
                    },
                    talismans: {
                        'WEDDING_RING_0': {
                            name: "Shiny Yellow Rock",
                            rarity: "common",
                            texture: "/item/WEDDING_RING_0"
                        },
                        'WEDDING_RING_2': {
                            name: "Mediocre Ring of Love",
                            rarity: "uncommon",
                            texture: "/head/8fb265c8cc6136063b4eb15450fe1fe1ab7738b0bf54d265490e1ef49da60b7c"
                        },
                        'WEDDING_RING_4': {
                            name: "Modest Ring of Love",
                            rarity: "rare",
                            texture: "/head/8fb265c8cc6136063b4eb15450fe1fe1ab7738b0bf54d265490e1ef49da60b7c"
                        },
                        'WEDDING_RING_7': {
                            name: "Exquisite Ring of Love",
                            rarity: "epic",
                            texture: "/head/8fb265c8cc6136063b4eb15450fe1fe1ab7738b0bf54d265490e1ef49da60b7c"
                        },
                        'WEDDING_RING_9': {
                            name: "Legendary Ring of Love",
                            rarity: "legendary",
                            texture: "/head/8fb265c8cc6136063b4eb15450fe1fe1ab7738b0bf54d265490e1ef49da60b7c"
                        },

                        'CAMPFIRE_TALISMAN_1': {
                            name: "Campfire Initiate Badge",
                            rarity: "common",
                            texture: "/head/af41cc2250d2f5cfcf4384aa0cf3e23c19767549a2a8abd7532bd52c5a1de"
                        },
                        'CAMPFIRE_TALISMAN_4': {
                            name: "Campfire Adept Badge",
                            rarity: "uncommon",
                            texture: "/head/af41cc2250d2f5cfcf4384aa0cf3e23c19767549a2a8abd7532bd52c5a1de"
                        },
                        'CAMPFIRE_TALISMAN_8': {
                            name: "Campfire Cultist Badge",
                            rarity: "rare",
                            texture: "/head/a3cfd94e925eab4330a768afcae6c128b0a28e23149eee41c9c6df894c24f3de"
                        },
                        'CAMPFIRE_TALISMAN_13': {
                            name: "Campfire Scion Badge",
                            rarity: "epic",
                            texture: "/head/a3cfd94e925eab4330a768afcae6c128b0a28e23149eee41c9c6df894c24f3de"
                        },
                        'CAMPFIRE_TALISMAN_21': {
                            name: "Campfire Skyblock God Badge",
                            rarity: "legendary",
                            texture: "/head/4080bbefca87dc0f36536b6508425cfc4b95ba6e8f5e6a46ff9e9cb488a9ed"
                        },

                        'FARMING_TALISMAN': null,
                        'VACCINE_TALISMAN': {
                            name: "Vaccine Talisman",
                            rarity: "common",
                            texture: "/head/71408ede8b4f444015c59abd5cd32b8769de51881edabcc15abb6519f5b49"
                        },
                        'WOOD_TALISMAN': {
                            name: "Wood Affinity Talisman",
                            rarity: "uncommon",
                            texture: "/head/219ad5215ba6c7e4e4d0668f02d3a9c937ac536acc75ac49e7bd7b1c8ccf80"
                        },
                        'SKELETON_TALISMAN': null,
                        'COIN_TALISMAN': {
                            name: "Talisman of Coins",
                            rarity: "common",
                            texture: "/head/452dca68c8f8af533fb737faeeacbe717b968767fc18824dc2d37ac789fc77"
                        },
                        'MAGNETIC_TALISMAN': null,
                        'GRAVITY_TALISMAN': null,
                        'VILLAGE_TALISMAN': null,
                        'MINE_TALISMAN': null,
                        'NIGHT_VISION_CHARM': null,
                        'LAVA_TALISMAN': null,
                        'SCAVENGER_TALISMAN': null,
                        'FIRE_TALISMAN': null,
                        'PIGGY_BANK': null,
                        'CRACKED_PIGGY_BANK': null,
                        'BROKEN_PIGGY_BANK': null,
                        'PIGS_FOOT': null,
                        'WOLF_PAW': null,
                        'FROZEN_CHICKEN': null,
                        'FISH_AFFINITY_TALISMAN': null,
                        'FARMER_ORB': null,
                        'HASTE_RING': null,
                        'EXPERIENCE_ARTIFACT': null,
                        'NEW_YEAR_CAKE_BAG': null,
                        'DAY_CRYSTAL': {
                            name: "Day Crystal",
                            rarity: "rare",
                            texture: "/item/DAY_CRYSTAL"
                        },
                        'NIGHT_CRYSTAL': {
                            name: "Night Crystal",
                            rarity: "rare",
                            texture: "/item/NIGHT_CRYSTAL"
                        },
                        'FEATHER_TALISMAN': null,
                        'FEATHER_RING': null,
                        'FEATHER_ARTIFACT': null,
                        'POTION_AFFINITY_TALISMAN': null,
                        'RING_POTION_AFFINITY': null,
                        'ARTIFACT_POTION_AFFINITY': null,
                        'HEALING_TALISMAN': null,
                        'HEALING_RING': null,
                        'CANDY_TALISMAN': null,
                        'CANDY_RING': null,
                        'CANDY_ARTIFACT': null,
                        'MELODY_HAIR': {
                            name: "Melody's Hair",
                            rarity: "epic",
                            texture: "/item/MELODY_HAIR"
                        },
                        'SEA_CREATURE_TALISMAN': {
                            name: "Sea Creature Talisman",
                            rarity: "common",
                            texture: "/head/eaa44b170d749ce4099aa78d98945d193651484089efb87ba88892c6fed2af31"
                        },
                        'SEA_CREATURE_RING': null,
                        'SEA_CREATURE_ARTIFACT': null,
                        'INTIMIDATION_TALISMAN': null,
                        'INTIMIDATION_RING': null,
                        'INTIMIDATION_ARTIFACT': null,
                        'WOLF_TALISMAN': null,
                        'WOLF_RING': null,
                        'BAT_TALISMAN': null,
                        'BAT_RING': null,
                        'BAT_ARTIFACT': null,
                        'DEVOUR_RING': null,
                        'ZOMBIE_TALISMAN': null,
                        'ZOMBIE_RING': null,
                        'ZOMBIE_ARTIFACT': null,
                        'SPIDER_TALISMAN': null,
                        'SPIDER_RING': null,
                        'SPIDER_ARTIFACT': null,
                        'ENDER_ARTIFACT': null,
                        'TARANTULA_TALISMAN': null,
                        'SURVIVOR_CUBE': null,
                        'WITHER_ARTIFACT': null,
                        'RED_CLAW_TALISMAN': null,
                        'RED_CLAW_RING': null,
                        'RED_CLAW_ARTIFACT': null,
                        'BAIT_RING': null,
                        'SHADY_RING': null,
                        'CROOKED_ARTIFACT': null,
                        'SEAL_OF_THE_FAMILY': null,
                        'HUNTER_TALISMAN': null,
                        'HUNTER_RING': null,
                        'PARTY_HAT_CRAB': null,
                        'POTATO_TALISMAN': null,
                        'PERSONAL_COMPACTOR_4000': {
                            name: "Personal Compactor 4000",
                            rarity: "uncommon",
                            texture: "/item/PERSONAL_COMPACTOR_4000"
                        },
                        'PERSONAL_COMPACTOR_5000': {
                            name: "Personal Compactor 5000",
                            rarity: "rare",
                            texture: "/item/PERSONAL_COMPACTOR_5000"
                        },
                        'PERSONAL_COMPACTOR_6000': {
                            name: "Personal Compactor 6000",
                            rarity: "epic",
                            texture: "/item/PERSONAL_COMPACTOR_6000"
                        },
                        'SPEED_TALISMAN': {
                            name: "Speed Talisman",
                            rarity: "common",
                            texture: "/head/8624bacb5f1986e6477abce4ae7dca1820a5260b6233b55ba1d9ba936c84b"
                        },
                        'SPEED_RING': {
                            name: "Speed Ring",
                            rarity: "uncommon",
                            texture: "/head/c2da40a91f8fa7e1cbdd934da92a7668dc95d75b57c9c80a381c5e178cee6ba7"
                        },
                        'SPEED_ARTIFACT': {
                            name: "Speed Artifact",
                            rarity: "rare",
                            texture: "/head/f06706eecb2d558ace27abda0b0b7b801d36d17dd7a890a9520dbe522374f8a6"
                        },
                        'CAT_TALISMAN': {
                            name: "Cat Talisman",
                            rarity: "uncommon",
                            texture: "/head/3a12188258601bcb7f76e3e2489555a26c0d76e6efec2fd966ca372b6dde00"
                        },
                        'LYNX_TALISMAN': {
                            name: "Lynx Talisman",
                            rarity: "rare",
                            texture: "/head/12b84e9c79815a39b7be8ce6e91248d71f760f42b5a4de5e266b44b87a952229"
                        },
                        'CHEETAH_TALISMAN': {
                            name: "Cheetah Talisman",
                            rarity: "epic",
                            texture: "/head/1553f8856dd46de7e05d46f5fc2fb58eafba6829b11b160a1545622e89caaa33"
                        },
                        'SCARF_STUDIES': {
                            name: "Scarf's Studies",
                            rarity: "rare",
                            texture: "/head/6de4ab129e137f9f4cbf7060318ee1748dc39da9b5d129a8da0e614e2337693"
                        },
                        'SCARF_THESIS': {
                            name: "Scarf's Thesis",
                            rarity: "epic",
                            texture: "/head/8ce4c87eb4dde27459e3e7f85921e7e57b11199260caa5ce63f139ee3d188c"
                        },
                        'SCARF_GRIMOIRE': {
                            name: "Scarf's Grimoire",
                            rarity: "legendary",
                            texture: "/head/bafb195cc75f31b619a077b7853653254ac18f220dc32d1412982ff437b4d57a"
                        },
                        'TREASURE_TALISMAN': {
                            name: "Treasure Talisman",
                            rarity: "rare",
                            texture: "/head/31f320025142596396032cc0088e2ac36489f24cfa5e9dda13e081cf69f77f4d"
                        },
                        'TREASURE_RING': {
                            name: "Treasure Ring",
                            rarity: "epic",
                            texture: "/head/6a1cc5525a217a399b5b86c32f0f22dd91378874b5f44d5a383e18bc0f3bc301"
                        },
                        'TREASURE_ARTIFACT': {
                            name: "Treasure Artifact",
                            rarity: "legendary",
                            texture: "/head/e10f20a55b6e188ebe7578459b64a6fbd825067bc497b925ca43c2643d059025"
                        },
                        'MINERAL_TALISMAN': {
                            name: "Mineral Talisman",
                            rarity: "rare",
                            texture: "/head/3cbd70f73e2e09566ef914c697b13f48b97bfd6c11c83e540a15ff4d736b9c16"
                        },
                        'BEASTMASTER_CREST_COMMON': {
                            name: "Beastmaster Crest",
                            rarity: "common",
                            texture: "/head/53415667de3fb89c5f40c880c39e4971a0caa7f3a9d2c8f712ba37fadcee"
                        },
                        'BEASTMASTER_CREST_UNCOMMON': {
                            name: "Beastmaster Crest",
                            rarity: "uncommon",
                            texture: "/head/53415667de3fb89c5f40c880c39e4971a0caa7f3a9d2c8f712ba37fadcee"
                        },
                        'BEASTMASTER_CREST_RARE': {
                            name: "Beastmaster Crest",
                            rarity: "rare",
                            texture: "/head/53415667de3fb89c5f40c880c39e4971a0caa7f3a9d2c8f712ba37fadcee"
                        },
                        'BEASTMASTER_CREST_EPIC': {
                            name: "Beastmaster Crest",
                            rarity: "epic",
                            texture: "/head/53415667de3fb89c5f40c880c39e4971a0caa7f3a9d2c8f712ba37fadcee"
                        },
                        'BEASTMASTER_CREST_LEGENDARY': {
                            name: "Beastmaster Crest",
                            rarity: "legendary",
                            texture: "/head/53415667de3fb89c5f40c880c39e4971a0caa7f3a9d2c8f712ba37fadcee"
                        },
                        'RAGGEDY_SHARK_TOOTH_NECKLACE': {
                            name: "Raggedy Shark Tooth Necklace",
                            rarity: "common",
                            texture: "/head/d77309ddebbdc278ee2772d92fa4905dd850c5f213a77ffaed5a67eecb23984a"
                        },
                        'DULL_SHARK_TOOTH_NECKLACE': {
                            name: "Dull Shark Tooth Necklace",
                            rarity: "uncommon",
                            texture: "/head/f3ab3aa1ade74915dacd298613904361c18877eebfa81d9f936309f271e1389a"
                        },
                        'HONED_SHARK_TOOTH_NECKLACE': {
                            name: "Honed Shark Tooth Necklace",
                            rarity: "rare",
                            texture: "/head/e6b120938d83bf49ddab3a78666a0bf37a3de7b46b9d97b984da3be62ce3e5e3"
                        },
                        'SHARP_SHARK_TOOTH_NECKLACE': {
                            name: "Sharp Shark Tooth Necklace",
                            rarity: "epic",
                            texture: "/head/228e3fb6bd9887d60434ccd279ec3e59227826c9a2f8dd9ce9899ea6683d4ee8"
                        },
                        'RAZOR_SHARP_SHARK_TOOTH_NECKLACE': {
                            name: "Razor Sharp Shark Tooth Necklace",
                            rarity: "legendary",
                            texture: "/head/7792676664ac711488641f72b25961835613da9ffd43ea3bdd163cb365343a6"
                        },
                        'HEGEMONY_ARTIFACT': {
                            name: "Hegemony Artifact",
                            rarity: "legendary",
                            texture: "/head/313384a293cfbba3489b483ebc1de7584ca2726d7f5c3a620513474925e87b97"
                        },
                        'BITS_TALISMAN': {
                            name: "Bits Talisman",
                            rarity: "rare",
                            texture: "/head/2ebadb1725aa85bb2810d0b73bf7cd74db3d9d8fc61c4cf9e543dbcc199187cc"
                        },
                        'BAT_PERSON_TALISMAN': {
                            name: "Bat Person Talisman",
                            rarity: "common",
                            texture: "/head/b841a49b199a59c431bf3fc3783f6b6545ce78c38042617f66ebd87cdd548e8c"
                        },
                        'BAT_PERSON_RING': {
                            name: "Bat Person Ring",
                            rarity: "uncommon",
                            texture: "/head/b4451ecf2584a36de4297031c6d852977d3e249e85a3f0add967fcd7d6bde953"
                        },
                        'BAT_PERSON_ARTIFACT': {
                            name: "Bat Person Artifact",
                            rarity: "rare",
                            texture: "/head/c4444c3982720b30938f504c4374232b11a4f6f56cd57c973d8abb07fd0dcff7"
                        },
                        'CANDY_RELIC': {
                            name: "Candy Relic",
                            rarity: "legendary",
                            texture: "/head/39668767f1141835e2c49ad2b415598f1b166be9173902a0257e77704f913e1f"
                        },
                        'LUCKY_HOOF': null,
                        'ETERNAL_HOOF': null,
                        'WITHER_RELIC': {
                            name: "Wither Relic",
                            rarity: "epic",
                            texture: "/head/964e1c3e315c8d8fffc37985b6681c5bd16a6f97ffd07199e8a05efbef103793"
                        },
                        'CATACOMBS_EXPERT_RING': {
                            name: "Catacombs Expert Ring",
                            rarity: "epic",
                            texture: "/head/c078c68f6f9669370ea39be72945a3a8688e0e024e5d6158fd854fb2b80fb"
                        },
                        'AUTO_RECOMBOBULATOR': {
                            name: "Auto Recombobulator",
                            rarity: "legendary",
                            texture: "/head/5dff8dbbab15bfbb11e23b1f50b34ef548ad9832c0bd7f5a13791adad0057e1b"
                        }
                    }
                }
            }

            function getPlayerSkill(skillExp, slayerExp) {
                return Math.round(Math.pow(skillExp / 1, 0.5))
            }

            let lastUpdateBots = 0

            // let fragrunbots = []


            // function updateFragRunBots(a){
            //     if(Date.now()-lastUpdateBots < 60000*5 && !a) return;
            //     lastUpdateBots = Date.now()
            //     new Thread(()=>{

            //         fragrunbots = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/mcBot/getBots.json")).bots
            //     }).start()
            // }

            // updateFragRunBots()
            // register("worldLoad",()=>{
            //     updateFragRunBots()
            // })

        } else {
            ChatLib.chat("&cYou are not a bot, why do you have this")
            ChatLib.command("ct delete sbgbot", true)
            // new Message(new TextComponent("&cGo to https://soopymc.my.to/guildbot to register").setHover("show_text")).chat()
        }
    }).start()

    let areaData = {
        "hub": {
            "Display": "Hub",
            "Scoreboard": [
                "Auction House",
                "Bank",
                "Bazaar Alley",
                "Blacksmith",
                "Builder's House",
                "Coal Mine",
                "Colosseum",
                "Community Center",
                "Farm House",
                "Farm",
                "Fashion Shop",
                "Flower House",
                "Forest",
                "Graveyard",
                "High Level",
                "Mountain",
                "Ruins",
                "Village",
                "Wilderness",
                "Wizard Tower"
            ]
        },
        "combat_1": {
            "Display": "Spider's Den",
            "Scoreboard": [
                "Spider's Den"
            ]
        },
        "combat_2": {
            "Display": "Blazing Fortress",
            "Scoreboard": [
                "Blazing Fortress"
            ]
        },
        "combat_3": {
            "Display": "The End",
            "Scoreboard": [
                "The End",
                "Dragon's Nest"
            ]
        },
        "foraging_1": {
            "Display": "The Park",
            "Scoreboard": [
                "Birch Park",
                "Howling Cave",
                "Spruce Woods",
                "Birch Park",
                "Dark Thicket",
                "Savanna Woodland",
                "Jungle Island"
            ]
        },
        "farming_1": {
            "Display": "The Barn",
            "Scoreboard": [
                "The Barn"
            ]
        },
        "farming_2": {
            "Display": "Mushroom Desert",
            "Scoreboard": [
                "Mushroom Desert"
            ]
        },
        "mining_1": {
            "Display": "Gold Mine",
            "Scoreboard": [
                "Gold Mine"
            ]
        },
        "mining_2": {
            "Display": "Deep Caverns",
            "Scoreboard": [
                "Deep Caverns",
                "Gunpowder Mines",
                "Lapis Quarry",
                "Pigmen's Den",
                "Slimehill",
                "Diamond Reserve",
                "Obsidian Sanctuary"
            ]
        },
        "mining_3": {
            "Display": "Dwarven Mines",
            "Scoreboard": [
                "Aristocrat Passage",
                "Cliffside Veins",
                "Divan's Gateway",
                "Dwarven Mines",
                "Dwarven Village",
                "Far Reserve",
                "Forge Basin",
                "Goblin Burrows",
                "Hanging Court",
                "Palace Bridge",
                "Rampaert's Quarry",
                "Royal Mines",
                "Royal Palace",
                "Royal Quarters",
                "The Forge",
                "The Lift",
                "The Mist",
                "Upper Mines"
            ]
        },
        "winter": {
            "Display": "Jerry's Workshop",
            "Scoreboard": [

            ]
        },
        "dungeon_hub": {
            "Display": "Dungeons Hub",
            "Scoreboard": [

            ]
        },
        "dynamic": {
            "Display": "Private island"
        }
    }

})


let add_dashes_to_uuid = i => i.substr(0, 8) + "-" + i.substr(8, 4) + "-" + i.substr(12, 4) + "-" + i.substr(16, 4) + "-" + i.substr(20);

function urlToFile(url, destination, connecttimeout, readtimeout) {
    const d = new File(destination);
    d.getParentFile().mkdirs();
    const connection = new URL(url).openConnection();
    connection.setDoOutput(true);
    connection.setConnectTimeout(connecttimeout);
    connection.setReadTimeout(readtimeout);
    const IS = connection.getInputStream();
    const FilePS = new PrintStream(destination);
    let buf = new Packages.java.lang.reflect.Array.newInstance(Byte.TYPE, 65536);
    let len;
    while ((len = IS.read(buf)) > 0) {
        FilePS.write(buf, 0, len);
    }
    IS.close();
    FilePS.close();
}


function flattenArr(arr){
    let ret = []
    arr.forEach(e=>{
        if(Array.isArray(e)){
            ret.push(...flattenArr(e))
        }else{
            ret.push(e)
        }
    })

    return ret
}