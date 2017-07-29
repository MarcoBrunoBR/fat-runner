((global) => {

    global.Game = function(match){
        //quando o ser vivo clicar aqui me avisa
        match.click()

        //quando o o ser vivo do outro lado clicar eu te aviso
        match.on("otherPlayerClicked", function(){

        })
    }
})(window)