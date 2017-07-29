((global) => {
    global.Component  = Object.seal({
        render: function(){
            throw new Error("Component didn't implement render function")
        }
    })
})(window)