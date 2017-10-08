;((global, withLogging, withConnection) => {
    global.SonicIOInterface = function(){
        return {
            createSocket: () => withConnection(withLogging(
                new SonicSocket()
            ))
        }
    }
})(window, IOSocketWithLogging, IOSocketWithConnection, SonicSocket)