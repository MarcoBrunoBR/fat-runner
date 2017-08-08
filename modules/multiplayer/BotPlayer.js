((global) => {

    global.BotPlayer = function(){

        const player = new Player()
        const playerController = player.controller()

        const start = () => {
            setInterval(() => {
                playerController.click()
            }, 175)
        }

        return Objectz.compose(player, {
            start: start
            ,controller: () => Objectz.compose(playerController, {
                click: () => {}
            })
        })
    }

})(window, Objectz.compose, EventEmitter2, Player)            


            