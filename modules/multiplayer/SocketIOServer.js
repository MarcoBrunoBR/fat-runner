;((global) => {
    const socketIOInterface = new SocketIOIOInterface("http://192.168.86.102:3000")
    global.SocketIOServer = Server.bind(this, socketIOInterface)
})(window, SocketIOIOInterface, Server)