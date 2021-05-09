const express = require('express');
const app = express();
const http = require("http").Server(app);


const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {crearToken, desifraToken} = require('../methods/token')

const router = express.Router();

router.get("/list", async (req, res) => {
    const n = await User.find();
    res.send(n);
});

router.post("/add", async (req, res) => {
    res.send("SIUU")
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

router.post("/login", async (req, res) => {
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

module.exports = {
    router
}