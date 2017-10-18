;((global, Server) => {

    global.LoadingRemoteMatchScreen = function(){

        const server = new Server()

        const state = Object.seal({
            connectionVisualFeedback: "Connecting..."
            ,connectionError: undefined
            ,startingMatch: false
        })

        const render = (dom, delegator, onAnimationFrame) => {

            const $element = dom`
            <div class="loadingRemoteMatch">
                <span class="loadingRemoteMatch-text">
                    ${state.connectionVisualFeedback}
                </span>
            </div>
            `

            const $loadingText = $element.querySelector('.loadingRemoteMatch-text')

            onAnimationFrame(stop => {
                if(!state.connectionError){
                    $loadingText.textContent = state.connectionVisualFeedback
                } else {
                    $loadingText.textContent = state.connectionError
                    stop()
                }
            })

            return $element
        }

        const asyncConfirmList = []

        const willUnmount = () => {
            if(!state.startingMatch){
                connectionVisualFeedback.end()
                connectionVisualFeedback.start("Closing connection")
                asyncConfirmList.forEach(asyncConfirm => {
                    asyncConfirm.remove()
                })
                return server.disconnect().then(() => connectionVisualFeedback.end())
            }
        }

        //TODO feedback with time to end visualization
        const connectionVisualFeedback = (() => {
            let loadInterval            
            return {
                start: (message) => {
                    let loadingCounter = -1
                    loadInterval = setInterval(() => {
                        loadingCounter++
                        state.connectionVisualFeedback = `${message}  ${
                            [".",".","."]
                                .filter((dot, index) => index <= (loadingCounter%3))
                                .join("")
                        }`
                    }, 500)
                }
                ,end: reason => {
                    loadInterval && clearInterval(loadInterval)
                    loadInterval = undefined
                    state.connectionError = reason || undefined
                }
            }
        })()
        
        const serverConnectionPromise = server.connect()

        const remoteMatchConnectionPipeline = () => {    
            connectionVisualFeedback.start("Connecting to servers")

            const matchPairing = (() => {
                const matchPairingEmitter = new EventEmitter2()
                return {
                    addMatch: matchId => {

                        const asyncConfirm = new AsyncConfirm()

                        asyncConfirmList.push(asyncConfirm)

                        //TODO aparecer matches em uma listagem e renderizar novo GameState de tela com loading
                        asyncConfirm.show("Iniciar partida: " + matchId + "?")
                            .then(() => {
                                matchPairingEmitter.emit('start', matchId)
                            })
                    }
                    ,wait: () => new Promise((resolve, reject) => {
                        matchPairingEmitter.on('start', (matchId) => {
                            resolve(matchId)
                        })
                    })
                }
            })()

            serverConnectionPromise
                .then(serverConnection => {
                    connectionVisualFeedback.end()
                    connectionVisualFeedback.start("Searching for an oponent")
                    return serverConnection.findPlayers()
                })
                .then(matchFoundEmitter => {
                    matchFoundEmitter.on('matchFound', (matchId) => {
                        matchPairing.addMatch(matchId)
                    })

                    matchPairing.wait().then(matchId => {
                        matchFoundEmitter.emit('chooseMatch', matchId)
                    })

                    return new Promise((resolve, reject) => {
                        matchFoundEmitter.on('matchConnection', (matchConnection) => {
                            resolve(matchConnection)
                        })
                    })
                })
                .then(matchConnection => {                    
                    connectionVisualFeedback.end()
                    matchConnection.on('disconnect', () => {
                        remoteMatchConnectionPipeline()
                    })
                    state.startingMatch = true
                    const remoteMatch = new RemoteMatch(matchConnection)
                    Game.state(GameState.ONLINE_2PLAYER, {remoteMatch})
                })
                .catch(error => {
                    connectionVisualFeedback.end(error)
                    server.disconnect()
                })
        }

        remoteMatchConnectionPipeline()
                
        return {
            render, willUnmount
        }
    }
})(window, SonicServer, Object.seal, DOMComponent, RemoteMatch, AsyncConfirm)
