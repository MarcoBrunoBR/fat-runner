((global) => {
    
    const states = [
        "INIT"
        ,"ONLINE_START"
        ,"OFFLINE_START"
    ]

    global.GameState = states.reduce((obj, state) => {
        obj[state] = state
        return obj
    }, {})

})(window)