((global) => {

    global.Player = function(){
        const eventEmmiter = new EventEmitter2()

        return {
            onReadyToStart: (callback) => eventEmmiter.on("readyToStart", callback)
            ,onClick: (callback) => eventEmmiter.on("click", callback)
            ,start: () => eventEmmiter.emit("start")
            ,rumbleController: () => eventEmmiter.emit("rumble")
            ,controller: () => ({
                sayIAmReadyToStart: () => eventEmmiter.emit("readyToStart")
                ,click: () => eventEmmiter.emit("click")
                ,onRumble: (callback) => eventEmmiter.on("rumble", callback)
            })            
        }
    }

})(window, EventEmitter2)            


            