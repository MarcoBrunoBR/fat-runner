((global) => {

    const root = new DOMRootComponent(document.querySelector("#gameScreen"))

    const stateMap = {
        [GameState.INIT] : (props) => root.mount(new InitialScreen(props))
        ,[GameState.SINGLE_PLAYER] : (props) => root.mount(new SinglePlayerScreen(props))
        ,[GameState.OFFLINE_2PLAYER] : (props) => root.mount(new TwoPlayerOfflineScreen(props))
        ,[GameState.SETUP_ONLINE_2PLAYER] : (props) => root.mount(new LoadingRemoteMatchScreen(props))
        ,[GameState.ONLINE_2PLAYER] : (props) => root.mount(new TwoPlayerOnlineScreen(props))
        ,"PREVIOUS": (props) => stateMap[history.state](props)

    }

    let undoPreviousState = () => Promise.resolve()
    const Game = {
        state: (gameState, props) => {
            return undoPreviousState()
                .then(() => stateMap[gameState](props))
                .then(undoMount => {
                    undoPreviousState = undoMount
                    window.history.pushState(gameState, "", "/")
                })
        }
    }

    global.Game = Game

    window.onpopstate = function(event) {
        Game.state(GameState.INIT)
    }

})(window, window.history, GameState, DOMRootComponent, InitialScreen, TwoPlayerOfflineScreen, SinglePlayerScreen, LoadingRemoteMatchScreen, TwoPlayerOnlineScreen)