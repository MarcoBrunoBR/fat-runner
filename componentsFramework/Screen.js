((global, compose) => {
    const screen = document.querySelector("#screen")

    global.Screen = compose(Component, {
        render: function(Component, props){
            const component = new Component(props)
            screen.innerHTML = ''
            screen.appendChild(component.render().getElement())
        }
    })

})(window, Objectz.compose, Component, document)
