((global) => {

    let previousState

    const stateMap = {
        [GameState.INIT] : (props) => new InitialScreen(props)
        ,[GameState.SINGLE_PLAYER] : (props) => new SinglePlayerScreen(props)
        ,[GameState.OFFLINE_2PLAYER] : (props) => new TwoPlayerOfflineScreen(props)
        ,[GameState.SETUP_ONLINE_2PLAYER] : (props) => new LoadingRemoteMatchScreen(props)
        ,[GameState.ONLINE_2PLAYER] : (props) => new TwoPlayerOnlineScreen(props)
        ,"PREVIOUS": (props) => stateMap[previousState](props)

    }

    const domPlumber = new DOMComponentPlumber(document.querySelector("#gameScreen"))
    const Game = {
        state: (gameState, props) => {
            return domPlumber
                .mount(stateMap[gameState](props))
                .then(() => {
                    previousState = history.state
                    window.history.pushState(gameState, "", "/")
                })
        }
    }

    global.Game = Game

    window.onpopstate = function(event) {
        Game.state(GameState.INIT)
    }

})(window, window.history, GameState, DOMComponentPlumber, InitialScreen, TwoPlayerOfflineScreen, SinglePlayerScreen, LoadingRemoteMatchScreen, TwoPlayerOnlineScreen)