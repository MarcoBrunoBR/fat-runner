((global)=> {
    function IphonePinchToZoomFix(event) {
        if (event.scale !== 1) { event.preventDefault() }
    }

    function IphoneDblTouchToZoomFix(event){
        event.preventDefault()
    }
    global.BrowserCompatibility = {
        setIphoneFix: () => {
            document.addEventListener('touchmove', IphonePinchToZoomFix, false)
            document.addEventListener('touchend', IphoneDblTouchToZoomFix, false)
        }
        ,unsetIphoneFix: () => {
            document.removeEventListener('touchmove', IphonePinchToZoomFix)
            document.removeEventListener('touchend', IphoneDblTouchToZoomFix)
        }
    }
})(window)