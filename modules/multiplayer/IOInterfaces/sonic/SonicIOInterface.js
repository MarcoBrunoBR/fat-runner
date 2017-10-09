;((global, withTransmissionLogging, withReceiveLogging,withOpenProcedure, withSelfMessagingPrevention) => {
    global.SonicIOInterface = function(){
        return {
            createSocket: () => 
                withReceiveLogging(
                withSelfMessagingPrevention(
                withOpenProcedure(
                withTransmissionLogging(
                    new SonicSocket()
                ))))
        }
    }
})(window, IOSocketWithTransmissionLogging, IOSocketWithReceiveLogging, IOSocketWithOpenProcedure, IOSocketWithPlayerConnection, SonicSocket)