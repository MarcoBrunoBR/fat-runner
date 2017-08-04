((global) => {

    const stateMap = {
        [GameState.INIT] : (props) => Screen.render(InitialScreen, props)
        ,[GameState.ONLINE_START] : (props) => Screen.render(OnlineGameScreen, props)
        ,[GameState.SINGLE_PLAYER] : (props) => Screen.render(SinglePlayerScreen, props)
        ,[GameState.OFFLINE_2PLAYER] : (props) => Screen.render(OfflineGameScreen, props)
    }

    global.Game = {
        state: (gameState, props) => {
            stateMap[gameState](props)
            window.history.pushState(gameState, "", "/")
        }
    }

    window.onpopstate = function(event) {
        stateMap[GameState.INIT]()
    }

})(window, window.history, Screen, GameState, InitialScreen, OfflineGameScreen, SinglePlayerScreen)