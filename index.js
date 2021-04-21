const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const DATA = [
  {Piso: 1, Zona: "A", Posicion: 1, sel: false},
  {Piso: 1, Zona: "A", Posicion: 2, sel: false},
  {Piso: 1, Zona: "A", Posicion: 3, sel: false},
  {Piso: 1, Zona: "A", Posicion: 4, sel: false},
  {Piso: 1, Zona: "A", Posicion: 5, sel: false},
  {Piso: 1, Zona: "A", Posicion: 6, sel: false},
  {Piso: 1, Zona: "A", Posicion: 7, sel: false},
  {Piso: 1, Zona: "A", Posicion: 8, sel: false},
  {Piso: 1, Zona: "A", Posicion: 9, sel: false},
  {Piso: 1, Zona: "A", Posicion: 10, sel: false},
  {Piso: 1, Zona: "A", Posicion: 11, sel: false},
  {Piso: 1, Zona: "A", Posicion: 12, sel: false},
  {Piso: 1, Zona: "A", Posicion: 13, sel: false},
  {Piso: 1, Zona: "A", Posicion: 14, sel: false},
  {Piso: 1, Zona: "A", Posicion: 15, sel: false},
  {Piso: 1, Zona: "A", Posicion: 16, sel: false},
  {Piso: 1, Zona: "A", Posicion: 17, sel: false},
  {Piso: 1, Zona: "A", Posicion: 18, sel: false},
  {Piso: 1, Zona: "A", Posicion: 19, sel: false},
  {Piso: 1, Zona: "A", Posicion: 20, sel: false},
  {Piso: 1, Zona: "A", Posicion: 21, sel: false}
];

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
