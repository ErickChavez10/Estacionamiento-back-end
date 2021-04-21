const express = require('express');
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
    },
});