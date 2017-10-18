;((global) => {
    global.IOSocketWithPlayerConnection = socketPromise => socketPromise.then(socket => {

        const playerConnectionEmitter = new EventEmitter2()
        const playerConnectionEvents = [
            "matchFound"
        ]

        const matches = []

        const stringifySeqNumber = number => parseInt(number).toString().padStart(3, 0)
        const parseSeqNumber = numberString => parseInt(numberString)
        const mySeqNumber = Math.ceil(Math.random() * 998)

        const othersideConnectionStatusEmitter = new EventEmitter2()

        let connected = false
        othersideConnectionStatusEmitter.on("connected", () => {
            connected = true
        })

        let tryingConnTo = null
        let tryConnectionTimer


        function tryConnectingToMe(remoteId, remoteSeqNumber, foundYou){

            tryingConnTo = remoteId
            let otherSideFoundYou = !!foundYou

            function startHandshake(){
                const matchId = (mySeqNumber > remoteSeqNumber ? 'm'+mySeqNumber : 'm'+remoteSeqNumber) 
                const isMatchHappening = !!matches.find(match => match.id === matchId)
                if(!isMatchHappening){
                    preConnectionProcedure.stop()
                    preConnectionProcedure.start()
                    tryingConnTo = null
                    tryConnectionTimer = undefined
                    global.clearTimeout(tryConnectionTimer)
                    matches.push({id: matchId, players: [remoteId]})
                    playerConnectionEmitter.emit('matchFound', matchId)
                }
            }

            othersideConnectionStatusEmitter.on("foundYou", () => {
                otherSideFoundYou = true
            })

            preConnectionProcedure.stop()
            preConnectionProcedure.start(remoteId)
            
            tryConnectionTimer = setTimeout(function retry(){
                if(otherSideFoundYou){
                    global.clearTimeout(tryConnectionTimer)
                    tryConnectionTimer = undefined
                    startHandshake()
                }
                if(tryConnectionTimer){
                    tryConnectionTimer = setTimeout(retry, 2000)
                }
            }, 2000)
        }

        othersideConnectionStatusEmitter.on("thereAreOthersWaiting", () => {
            console.log("###### Tem gente esperando ########")
        })

        function handleConnectionRequest(headerString, data){
            if(!connected){
                const header = SonicDataParser.parseHeader(headerString)
                const origin = header.origin
                const destination = header.destination
                const messageName = header.messageName

                const isRequestingAnyone = destination === null && origin !== null && origin !== "self" && messageName === "fP"
                const isRequestingMe = destination === 'self' && origin !== null && origin !== "self" && messageName === "fP"
                
                if(isRequestingAnyone){
                    if(tryingConnTo === null){  
                        //TODO maybe adding to a queue ordered by frequency (descending) and try to connect from first to last
                        console.log("Achei alguém procurando qualquer um, vou tentar conectar", origin)
                        tryConnectingToMe(origin, data, false)
                    } else {
                        if(origin === tryingConnTo){
                            console.log("Estou tentando me conectar com alguém específico, mas ele não me achou", origin)
                            othersideConnectionStatusEmitter.emit("didNotFoundYou", origin)
                        } else {
                            othersideConnectionStatusEmitter.emit("thereAreOthersWaiting")
                        }
                    }
                } else if(isRequestingMe){
                    if(tryingConnTo === null){
                        console.log("Alguém tinha me achado e eu acabei de achar ele, vou tentar conectar", origin, destination)
                        tryConnectingToMe(origin, data, true)
                    } else if(tryingConnTo === origin){
                        console.log("Alguém me achou e eu já estava esperando ele", origin, destination)
                        othersideConnectionStatusEmitter.emit("foundYou", origin)
                    }
                }
            }
        }

        const preConnectionProcedure = (() => {

            let emitFPTimeoutTimerTime = 1000
            
            let emitFPTimeoutTimer
            let emitFindPlayerTimer
            let currentDestination

            function startFP(destination){
                socket.onAny(handleConnectionRequest)
                currentDestination = destination
                let lastFPSuccessfullyEmitted = true
                let selfRTT
                let selfStartTransmisionTimestamp

                socket.on(SonicDataParser.stringifyHeader({origin: 'self', messageName: 'fP', destination: currentDestination}), function(){

                    global.clearTimeout(emitFPTimeoutTimer)
                    emitFPTimeoutTimer = undefined

                    lastFPSuccessfullyEmitted = true
                    selfRTT = global.performance.now() - selfStartTransmisionTimestamp
                    console.log('### selfRTT ###' , selfRTT)

                    //Mudar a taxa de transmissão aqui, caso o rtt tenha melhorado ou não sido alterado baseado num treshold e não baseado nessa porra dessa variável booleana do caralho
                    //if I heard miself I can increase transmission rate
                    if(emitFPTimeoutTimerTime >= 1100){
                        emitFPTimeoutTimerTime -= 100
                        console.log("I heard myself, decreasing transmission interval to", emitFPTimeoutTimerTime / 5)
                    }
                })

                emitFindPlayerTimer = setTimeout(function retry(){
                    if(lastFPSuccessfullyEmitted){
                        lastFPSuccessfullyEmitted = false
                        selfStartTransmisionTimestamp = global.performance.now()
                        socket.emit(SonicDataParser.stringifyHeader({origin: 'self', messageName: 'fP', destination: currentDestination}), mySeqNumber)
                    } else {
                        if(!emitFPTimeoutTimer){
                            emitFPTimeoutTimer = setTimeout(() => {
                                emitFPTimeoutTimer = undefined
                                //if I didn't heard myself, I asume that is because of channel congestion so I decrease transmission rate

                                //Mudar a taxa de transmissão aqui, caso o rtt tenha piorado e não baseado nessa porra dessa variável booleana do caralho
                                if(!lastFPSuccessfullyEmitted){
                                    const newTimeoutTime = Math.ceil(emitFPTimeoutTimerTime * (Math.random() * (1.25 - 1) + 1))
                                    if(newTimeoutTime <= 5000){
                                        emitFPTimeoutTimerTime = newTimeoutTime
                                        console.log("Timedout: increasing transmission interval speed to", emitFPTimeoutTimerTime / 5)
                                    } else {
                                        console.log("Timedout but transmission interval is maximum already", emitFPTimeoutTimerTime)
                                    }
                                    lastFPSuccessfullyEmitted = true
                                }
                            }, emitFPTimeoutTimerTime)
                        }
                    }                        
                    emitFindPlayerTimer = setTimeout(retry, emitFPTimeoutTimerTime / 5)
                }, emitFPTimeoutTimerTime / 5)
            }

            function stopFP(){
                emitFPTimeoutTimerTime = 1000
                socket.offAny(handleConnectionRequest)
                socket.removeAllListeners(
                    SonicDataParser.stringifyHeader(
                        {origin: 'self', messageName: 'fP', destination: currentDestination}
                    )
                )
                if(emitFindPlayerTimer){
                    global.clearTimeout(emitFindPlayerTimer)
                    emitFindPlayerTimer = undefined
                }
                if(emitFPTimeoutTimer){
                    global.clearTimeout(emitFPTimeoutTimer)
                    emitFPTimeoutTimer = undefined
                }
                currentDestination = undefined
            }
            
            return {
                start: (destination) => startFP(destination)
                ,stop: () => stopFP()
            }
        })()

        const withMatchConnection = (socketPromise, matchId) => socketPromise.then(socket => {
            const matchEventsEmitter = new EventEmitter2()
            
            const match = matches.find(match => match.id === matchId)

            socket.onAny((headerString, data) => {
                const header = SonicDataParser.parseHeader(headerString)
                if(header.destination === matchId && match && match.players.indexOf(header.origin) >= 0){
                    matchEventsEmitter.emit(header.messageName, data)
                }
            })

            const disconnect = () => {
                return Promise.resolve((() => {
                    matches.splice(matches.indexOf(match), 1)
                    socket.close()
                })())
            }

            const matchEmit = (eventName) => {
                const header = SonicDataParser.parseHeader(eventName)
                header.destination = matchId

                if(header.messageName === 'disconnect'){
                    disconnect().then(() => {
                        socket.emit(SonicDataParser.stringifyHeader(header), undefined)
                    })
                } else {
                    socket.emit(SonicDataParser.stringifyHeader(header), undefined)
                }
            }

            return Object.assign({}, socket, {
                emit: matchEmit
                ,on: (eventName, cb) => {
                    matchEventsEmitter.on(eventName, cb)
                }
            })
        })

        const listenWithHandler = (handler, cb, eventName) => {          
            if(handler === "onAny") {
                socket.onAny(cb)
                playerConnectionEmitter.onAny(cb)
            } else {
                const emitter = playerConnectionEvents.indexOf(eventName) > -1 
                    ? playerConnectionEmitter
                    : socket

                emitter[handler](eventName, cb)
            }
        }

        return Object.assign({}, socket, {
            close : () => {
                preConnectionProcedure.stop()
                tryingConnTo = null
                tryConnectionTimer = undefined
                global.clearTimeout(tryConnectionTimer)
                socket.close()
            }
            ,searchNearby: () => {
                preConnectionProcedure.start()
            }
            ,connect: (matchId) => {
                preConnectionProcedure.stop()
                const matchIndex = matches.indexOf({id: matchId})
                const match = matches[matchIndex]
                // matches.splice(matchIndex, 1)
                
                return withMatchConnection(Promise.resolve(socket), matchId)
            }
            ,on: (eventName, callback) => listenWithHandler("on", callback, eventName)
            ,once: (eventName, callback) => listenWithHandler("once", callback, eventName)
            ,onAny: (callback) => listenWithHandler("onAny", callback)
        })
    })
})(window, EventEmitter2, SonicDataParser)