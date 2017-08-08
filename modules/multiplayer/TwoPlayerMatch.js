((global) => {
    global.TwoPlayerMatch = function(){
        return new Match({
            MAX_POINTS: 20
            ,initCountdownFrom: 3
            ,player1: new Player()
            ,player2: new Player()
        })
    }
})(window, Objectz.compose, Match, Player)