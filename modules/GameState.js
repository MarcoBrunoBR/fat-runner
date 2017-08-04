((global) => {
    
    const states = [
        "INIT"
        ,"OFFLINE_2PLAYER"
        ,"SINGLE_PLAYER"
    ]

    global.GameState = states.reduce((obj, state) => {
        obj[state] = state
        return obj
    }, {})

})(window)