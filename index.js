const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const db = require('./config/db')
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const {crearToken, desifraToken} = require('./methods/token')
const {exist} = require('./methods/index');
const DATA = require('./data');

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

app.get("/data", (req, res) => {
  res.send(DATA)
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

          res.send({
            res: {
              status: 'success',
            },
            user: await newUser.save(),
            token: crearToken(user, 'Secreta', '168hr')
          })
        } else {
          // MALAS CONTRASEÑAS
          res.send({
            res: {
              status: 'error',
              msg: "no_match"
            }
          })
        }
      } else {
        // CAMPOS VACIOS
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
  console.log("[Conectado]",socket.id)
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("Selecciona", (posicion, zona, piso, token) => {
    const {user} = desifraToken(token);
    let disponible = true;
    let ocupado = null;

    DATA.forEach(elem => {
      if (elem.user._id == user._id) {
        if (elem.Posicion == posicion && elem.Zona == zona && elem.Piso == piso) {
          disponible = true;
          ocupado = null;
        } else {
          disponible = false;
          ocupado = elem;
        }
      }
    });

    if (disponible) {
      const res = DATA.filter(elem => {
        if (posicion == elem.Posicion && zona == elem.Zona && piso == elem.Piso) {
          if (elem.user._id == '' || elem.user._id == user._id) {
            if (elem.user._id == '') {
              elem.sel = !elem.sel;
              elem.user._id = user._id;
              elem.user.auto = user.auto;
              disponible = true;
            } else {
              elem.sel = !elem.sel;
              elem.user._id = '';
              elem.user.auto = '';
              disponible = true;
            }
          } else {
            ocupado = elem.user.auto;
            disponible = false;
          }
          return elem;
        }
        return elem;
      });
      if (disponible) {
        io.emit("Selecciona", res);
      } else {
        socket.emit('externo', {status: 'ocupado', auto: ocupado});
        ocupado = null;
      }
    } else {
      socket.emit('externo', {status: 'existe', existe: ocupado});
      ocupado = null;
    }
  });
});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
