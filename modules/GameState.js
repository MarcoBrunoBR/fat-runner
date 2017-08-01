((global) => {
    
    const states = [
        "INIT"
        ,"ONLINE_START"
        ,"OFFLINE_2PLAYER"
        ,"SINGLE_PLAYER"
    ]

    global.GameState = states.reduce((obj, state) => {
        obj[state] = state
        return obj
    }, {})

})(window)