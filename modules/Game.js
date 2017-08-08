((global) => {

    const root = new DOMRootComponent(document.querySelector("#gameScreen"))

    const stateMap = {
        [GameState.INIT] : (props) => root.mount(new InitialScreen(props))
        ,[GameState.ONLINE_START] : (props) => root.mount(new OnlineGameScreen(props))
        ,[GameState.SINGLE_PLAYER] : (props) => root.mount(new SinglePlayerScreen(props))
        ,[GameState.OFFLINE_2PLAYER] : (props) => root.mount(new TwoPlayerOfflineScreen(props))
        ,"PREVIOUS": (props) => stateMap[history.state](props)

    }

    let undoPreviousState = () => Promise.resolve()
    global.Game = {
        state: (gameState, props) => {
            return undoPreviousState()
                .then(() => stateMap[gameState](props))
                .then(undoMount => {
                    undoPreviousState = undoMount
                    window.history.pushState(gameState, "", "/")
                })
        }
    }

    window.onpopstate = function(event) {
        stateMap[GameState.INIT]()
    }

})(window, window.history, GameState, DOMRootComponent, InitialScreen, TwoPlayerOfflineScreen, SinglePlayerScreen)