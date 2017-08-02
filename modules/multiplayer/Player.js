((global) => {

    global.Player = function(){
        const eventEmmiter = new EventEmitter2()

        return {
            onSayIAmReadyToStart: (callback) => eventEmmiter.on("sayIAmReadyToStart", callback)
            ,onStart: (callback) => eventEmmiter.on("start", callback)
            ,onClick: (callback) => eventEmmiter.on("click", callback)
            ,start: () => eventEmmiter.emit("start")
            ,controller: () => ({
                sayIAmReadyToStart: () => eventEmmiter.emit("sayIAmReadyToStart")
                ,click: () => eventEmmiter.emit("click")
            })            
        }
    }

})(window, EventEmitter2)            


            