const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const db = require('./config/db')
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const crearToken = require('./methods/token')
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
db;
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
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/list", (req, res) => {
  res.send(DATA);
});



app.get("/users", async (req, res) => {
  const n = await User.find();
  res.send(n);
});

app.post("/addUser", async (req, res) => {
  if (req.body) {
    const {name, auto, email, password, password_confirm} = req.body;
    const user = await User.findOne({email: email});
    if (user) {
      // EL EMAIL YA EXISTE
      res.send({
        res: {
          status: 'error',
          msg: 'user_exist'
        }
      })
    } else {
      // EL EMAIL NO EXISTE
      if (name && auto && email && password && password_confirm) {
        if (password == password_confirm) {
          //TODO BIEN
          // Crea nuevo usuario
          const newUser = new User(req.body);
          // Encripta la contraseña
          const hash = await bcrypt.hash(password, 10);
          // Le asigna la contraseña encriptada al usuario
          newUser.password = hash;

          console.log('registrado')
          res.send({
            res: {
              status: 'success',
            },
            user: await newUser.save(),
            token: crearToken(user, 'Secreta', '168hr')
          })
        } else {
          // MALAS CONTRASEÑAS
          console.log('no coinciden')
          res.send({
            res: {
              status: 'error',
              msg: "no_match"
            }
          })
        }
      } else {
        // CAMPOS VACIOS
        console.log('campos vacios')
        res.send({
          res: {
            status: "error",
            msg: 'empty_fields'
          }
        })
      }
    }
  }
});


app.post("/login", async (req, res) => {
  console.log(req.body);
  const {email, password} = req.body;
  const user = await User.findOne({email})
  if (user) {
    const compare_pass = await bcrypt.compare(password, user.password);
    if (compare_pass) {
      res.send({
        res: {
          status: 'success',
          token: crearToken(user, 'Secreta', '168hr'),
          user: user,
        }
      })
    } else {
      res.send({
        res: {
          status: 'error',
          msg: 'password_not_match'
        }
      })
    }
  } else {
    res.send({
      res: {
        status: 'error',
        msg: 'email_not_match'
      }
    })
  }
})


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

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
