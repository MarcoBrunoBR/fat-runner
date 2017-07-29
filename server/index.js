const config = require("./config")

const express = require("express")()

const server = require("http").Server(express)
const socket = require("socket.io")(server)

server.listen(config.SERVER_PORT, function(){
    console.log("Listening on ", config.SERVER_PORT)
})