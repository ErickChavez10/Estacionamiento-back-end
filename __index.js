const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const db = require('./config/db')
const bcrypt = require('bcryptjs');
const {crearToken, desifraToken} = require('./methods/token')

//routes
const {router} = require('./routes/user')

const io = require("socket.io")(http, {
    cors: {
        origin: "*",
    },
});
db;

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {

    socket.on('mensaje-propio-enviar', (msg) => {
        socket.emit('mensaje-propio-recibir', `[propio] ${msg}`);
        io.emit('mensaje-propio-recibir', `[Todos] ${msg}`);
    });

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    socket.on("Selecciona", (posicion, zona, piso, token) => {
        const {user} = desifraToken(token);

        let flag = false;
        const res = DATA.filter(elem => {
            if (posicion == elem.Posicion &&
                zona == elem.Zona && piso == elem.Piso) {
                if (elem.user._id == '' || elem.user._id == user._id) {
                    console.log('[elem]', elem)
                    elem.sel = !elem.sel;
                    elem.user._id = !user._id;
                    flag = true;
                } else {
                    console.log("[noup]", elem)
                }
                return elem;
            }
            return elem;
        });
        if (flag)
            io.emit("Selecciona", res);
    });
});


http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
