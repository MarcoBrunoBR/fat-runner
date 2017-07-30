((global, compose) => {
    const screen = document.querySelector("#screen")

    let previousComponent = undefined

    global.Screen = compose(Component, {
        render: function(Component, props){
            const component = new Component(props)
            ;((previousComponent && previousComponent.willUnmount()) || Promise.resolve())
                .then(() => component.willMount() || Promise.resolve())
                .then(() => {
                    screen.innerHTML = ''
                    screen.appendChild(component.render().getElement())
                    return component.didMount() || Promise.resolve()
                })
                .then(() => {
                    previousComponent = component                        
                })
                .catch(error => console.error(error))
        }
    })

})(window, Objectz.compose, Component)
