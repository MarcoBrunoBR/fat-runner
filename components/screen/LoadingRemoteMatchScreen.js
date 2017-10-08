;((global, Server) => {

    global.LoadingRemoteMatchScreen = function(){

        const server = new Server()

        const serverConnectionPromise = server.connect()

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

        const willUnmount = () => {
            if(!state.startingMatch){
                connectionVisualFeedback.end()
                connectionVisualFeedback.start("Closing connection")
                return serverConnectionPromise.then(connection =>{
                    connection.close()
                    connectionVisualFeedback.end()
                })
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

        const remoteMatchConnectionPipeline = () => {    
            connectionVisualFeedback.start("Connecting to servers")
            
            serverConnectionPromise
                .then(serverConnection => {
                    connectionVisualFeedback.end()
                    connectionVisualFeedback.start("Searching for an oponent")
                    return serverConnection.findPlayer()
                })
                .then(matchConnection => {                    
                    connectionVisualFeedback.end()
                    matchConnection.on('otherPlayerDisconnected', () => {
                        remoteMatchConnectionPipeline()
                    })
                    state.startingMatch = true
                    const remoteMatch = new RemoteMatch(matchConnection)
                    Game.state(GameState.ONLINE_2PLAYER, {remoteMatch})
                })
                .catch(error => {
                    connectionVisualFeedback.end(error)
                    serverConnectionPromise.then(serverConnection => serverConnection.close())
                })
        }

        remoteMatchConnectionPipeline()
                
        return {
            render, willUnmount
        }
    }
})(window, SonicServer, Object.seal, DOMComponent, RemoteMatch)