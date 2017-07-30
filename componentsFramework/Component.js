((global) => {
    global.Component  = Object.seal({
        render: function(){
            throw new Error("Component didn't implement render function")
        }
        ,willUnmount: function(){
            return Promise.resolve()
        }
        ,willMount: function(){
            return Promise.resolve()
        }
        ,didMount: function(){
            return Promise.resolve()
        }
    })
})(window)