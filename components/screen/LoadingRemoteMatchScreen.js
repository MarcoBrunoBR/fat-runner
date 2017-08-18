((global) => {

    global.LoadingRemoteMatchScreen = function(){

        const server = new Server("http://192.168.86.101:3000")

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

            onAnimationFrame((stop) => {
                if(!state.connectionError){
                    $loadingText.textContent = state.connectionVisualFeedback
                } else {
                    $loadingText.textContent = state.connectionError
                }
            })

            return $element
        }

        const willUnmount = () => {
            if(!state.startingMatch){
                server.disconnect()
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
                ,end: () => {
                    loadInterval && clearInterval(loadInterval)
                }
            }
        })()

        const serverConnectionPromise = server.connect()
        connectionVisualFeedback.start("Connecting to servers")

        const remoteMatchConnectionPipeline = () => {            
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
                    connectionVisualFeedback.end()
                    state.connectionError = error
                    console.error(error)
                    server.disconnect()
                })
        }

        remoteMatchConnectionPipeline()
                
        return Objectz.extends(DOMComponent, {
            render, willUnmount
        })
    }
})(window, Object.seal, Server, DOMComponent, RemoteMatch)