((global, compose) => {
    const screen = document.querySelector("#screen")

    global.Screen = compose(Component, {
        render: function(Component){
            const component = new Component()
            screen.appendChild(component.render())
        }
    })

})(window, Objectz.compose, Component, document)