((global) => {

    global.BotPlayer = function(){

        const player = new Player()

        const playerController = player.controller()

        const start = () => {
            setInterval(() => {
                playerController.click()
            }, 200)
        }

        return Objectz.compose(player, {
            onSayIAmReadyToStart: (callback) => callback()
            ,start: start
        })
    }

})(window, Objectz.compose, EventEmitter2, Player)            


            