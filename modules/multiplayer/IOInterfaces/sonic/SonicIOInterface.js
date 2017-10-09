;((global, withTransmissionLogging, withReceiveLogging,withOpenProcedure, withSelfMessagingPrevention, withPlayerConnection) => {
    global.SonicIOInterface = function(){
        return {
            createSocket: () => 
                withPlayerConnection(
                withReceiveLogging(
                withSelfMessagingPrevention(
                withOpenProcedure(
                withTransmissionLogging(
                    new SonicSocket()
                )))))
        }
    }
})(window, IOSocketWithTransmissionLogging, IOSocketWithReceiveLogging, IOSocketWithOpenProcedure, IOSocketWithIdentity, IOSocketWithPlayerConnection ,SonicSocket)