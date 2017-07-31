((global) => {
    
    const states = [
        "INIT"
        ,"ONLINE_START"
        ,"OFFLINE_START"
        ,"SINGLE_PLAYER"
    ]

    global.GameState = states.reduce((obj, state) => {
        obj[state] = state
        return obj
    }, {})

})(window)