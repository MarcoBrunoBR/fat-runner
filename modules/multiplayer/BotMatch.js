((global) => {
    global.BotMatch = function(){
        return new Match({
            MAX_POINTS: 20
            ,initCountdownFrom: 3
            ,player1: new BotPlayer()
            ,player2: new Player()
        })
    }
})(window, Objectz.compose, Match, Player, BotPlayer)