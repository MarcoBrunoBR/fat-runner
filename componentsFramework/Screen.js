((global, compose) => {
    const gameScreen = document.querySelector("#gameScreen")

    let previousComponent = undefined

    global.Screen = compose(Component, {
        render: function(Component, props){
            const component = new Component(props)
            ;((previousComponent && previousComponent.willUnmount()) || Promise.resolve())
                .then(() => component.willMount() || Promise.resolve())
                .then(() => {
                    gameScreen.innerHTML = ''
                    gameScreen.appendChild(component.render().getElement())
                    return component.didMount() || Promise.resolve()
                })
                .then(() => {
                    previousComponent = component                        
                })
                .catch(error => console.error(error))
        }
    })

    screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation

    if (screen.lockOrientationUniversal && screen.lockOrientationUniversal("portrait")) {
        
    } else if(!screen.lockOrientationUniversal){
        screen.orientation.lock("portrait")
    } else {
        console.log("failed to lock")
    }

})(window, Objectz.compose, Component)
