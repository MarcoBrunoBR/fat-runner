((global)=> {
    function IphonePinchToZoomFix(event) {
        if (event.scale !== 1) { event.preventDefault() }
    }

    function IphoneDblTouchToZoomFix(event){
        event.preventDefault()
    }
    global.BrowserCompatibility = {
        setIphoneFix: ($element = document) => {
            $element.addEventListener('touchmove', IphonePinchToZoomFix, false)
            $element.addEventListener('touchend', IphoneDblTouchToZoomFix, false)
        }
        ,unsetIphoneFix: ($element = document) => {
            $element.removeEventListener('touchmove', IphonePinchToZoomFix)
            $element.removeEventListener('touchend', IphoneDblTouchToZoomFix)
        }
    }
})(window)