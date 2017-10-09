;((global, withTransmissionLogging, withReceiveLogging,withConnectionVerification, withSelfMessagingPrevention) => {
    global.SonicIOInterface = function(){
        return {
            createSocket: () => 
                withReceiveLogging(
                withSelfMessagingPrevention(
                withConnectionVerification(
                withTransmissionLogging(
                    new SonicSocket()
                ))))
        }
    }
})(window, IOSocketWithTransmissionLogging, IOSocketWithReceiveLogging, IOSocketWithConnection, IOSocketWithPlayerConnection, SonicSocket)