const DATA = require('./data')
const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/list", (req, res) => {
  res.send(DATA);
});
// app.post("/addUser", (req, res) => {
//   if (req.body) {
//     const {name, auto, email, password, password_confirm} = req.body;
//     if (name && auto && email && password && password_confirm) {
//       if (password == password_confirm) {
//         //TODO BIEN
//       } else {
//         return {
//           res: "NO_COINCIDEN"
//         }
//       }
//     } else {
//       return {
//         res: "LLENAR_CAMPOS"
//       }
//     }
//   }
// });


io.on("connection", (socket) => {
  console.log("ALGUIEN SE CONECTÓ");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("Selecciona", (posicion, zona, piso) => {
    const res = DATA.filter(elem => {
      if (posicion == elem.Posicion &&
        zona == elem.Zona && piso == elem.Piso) {
        elem.sel = !elem.sel;
        return elem;
      }
      return elem;
    });
    io.emit("Selecciona", res);
  });
});

// app.use(require('./routes/lista'));

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
