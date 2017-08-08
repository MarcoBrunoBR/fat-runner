((global) => {

    screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation

    if (screen.lockOrientationUniversal && screen.lockOrientationUniversal("portrait")) {
        
    } else if(!screen.lockOrientationUniversal){
        screen.orientation.lock("portrait")
    } else {
        console.log("failed to lock")
    }

})(window)
