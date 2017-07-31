((global) => {

    const stateMap = {
        [GameState.INIT] : (props) => Screen.render(InitialScreen, props)
        ,[GameState.ONLINE_START] : (props) => Screen.render(OnlineGameScreen, props)
        ,[GameState.SINGLE_PLAYER] : (props) => Screen.render(SinglePlayerScreen, props)
        ,[GameState.OFFLINE_START] : (props) => Screen.render(OfflineGameScreen, props)
    }

    global.Game = {
        state: (gameState, props) => stateMap[gameState](props)
    }

})(window, Screen, GameState, InitialScreen, OfflineGameScreen, OnlineGameScreen, SinglePlayerScreen)