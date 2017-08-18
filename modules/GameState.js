((global) => {
    
    const states = [
        "INIT"
        ,"SINGLE_PLAYER"
        ,"OFFLINE_2PLAYER"
        ,"SETUP_ONLINE_2PLAYER"
        ,"ONLINE_2PLAYER"
    ]

    global.GameState = states.reduce((obj, state) => {
        obj[state] = state
        return obj
    }, {})

})(window)