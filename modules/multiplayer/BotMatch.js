((global) => {
    global.BotMatch = function({MAX_POINTS = 20, player = new Player()} = {}){
        return Objectz.compose(
            new Match({MAX_POINTS, player1: new BotPlayer(), player2: player})
            ,{
                getControllers: () => ([
                    player.controller()
                ])
            }
        )
    }
})(window, Objectz.compose, Match, Player, BotPlayer)