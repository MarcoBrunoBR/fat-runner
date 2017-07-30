((global) => {

    const stateMap = {
        [GameState.INIT] : () => Screen.render(InitialScreen)
        ,[GameState.ONLINE_START] : () => Screen.render()
        ,[GameState.OFFLINE_START] : () => Screen.render(OfflineGameScreen)
    }

    global.Game = {
        state: (gameState) => stateMap[gameState]()
    }

})(window, Screen, GameState, InitialScreen, OfflineGameScreen)