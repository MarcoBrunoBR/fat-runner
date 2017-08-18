((global) => {

    global.Player = function(){
        const eventEmmiter = new EventEmitter2()
        const controllers = {
            sayIAmReadyToStart: () => eventEmmiter.emit("readyToStart")
            ,click: () => eventEmmiter.emit("click")
            ,onRumble: (callback) => eventEmmiter.on("rumble", callback)
        }

        return {
            onReadyToStart: (callback) => eventEmmiter.on("readyToStart", callback)
            ,onClick: (callback) => eventEmmiter.on("click", callback)
            ,start: () => eventEmmiter.emit("start")
            ,rumbleController: () => eventEmmiter.emit("rumble")
            ,controller: () => controllers            
        }
    }

})(window, EventEmitter2)            


            