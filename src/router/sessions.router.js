const express = require("express");
//const mongoose = require("mongoose");
const router = express.Router();
const modeloUsuarios = require("../dao/DB/models/usuariosGithub.modelo.js");
const modeloUsers = require("../dao/DB/models/usuariosGithub.modelo.js");
const crypto = require("crypto");


const util = require("../util.js");

//PARA TRAER PASSPORT
const passport = require("passport");

router.get("/errorRegistro", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    error: "Error de registro",
    //AQUI SE PODRIA PONER UN REDIRECT
  });
});



router.post("/registro", util.passportCallRegister("register"), (req, res) => {
  if (req.user) {
    req.session.usuario = req.user;

  } else {
      const error = req.body.error; 
        return res.redirect("login", { error });
  }
});


router.post("/login", util.passportCall("loginLocal"), (req, res) => {
  if (req.user) {
    req.session.usuario = req.user;
    return res.redirect("/");
  } else {    
    const error = req.body.error;    
    return res.redirect("login", { error });
  }
});


router.get("/logout", (req, res) => {
  req.session.destroy((e) => console.log(e));
  res.redirect("/login?mensaje=Logout correcto!");

  // AGREGAR MENSAJE DE LOGOUT CORRECTO  CON FONDO AZUL
});

router.get(
  "/github",
  passport.authenticate("loginGithub", {
    successRedirect: "/",
    failureRedirect: "/api/sessions/errorGithub",
  }),
  (req, res) => {}
);


router.get(
  "/callbackGithub",
  passport.authenticate("loginGithub", {
    failureRedirect: "/api/sessions/errorGithub",
  }),
  (req, res) => {
    console.log(req.user);
    req.session.usuario = req.user;
    res.redirect("/");
  }
);

router.get("/errorGithub", (req, res) => {
  res.setHeader("Content-type", "application/json");
  res.status(200).json({
    error: "Error en github",
  });
});

// LOGIN DEL ADMINISTRADOR

router.post("/loginAdmin", async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.redirect("/loginAdmin?error=Faltan datos");
  }

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.usuario = {
      nombre: "Coder",
      email: "adminCoder@coder.com",
      role: "administrador",
    };
    // Se puso hardcodeado adminCoder@coder.com en el código de sessions.router.js porque no debía estar en la base de datos de usuarios.
    return res.redirect("/");
  } else {
    // Autenticación fallida
    return res.redirect("/loginAdmin?error=Credenciales incorrectas");
  }
});


module.exports = router;


/*
router.get("/current", (req, res) => {
  if (req.isAuthenticated()) {
    // Si el usuario está autenticado, puedes acceder a la información del usuario a través de req.user
    const usuarioActual = req.user;
    res.status(200).json(usuarioActual);
  } else {
    // Si el usuario no está autenticado, puedes devolver un objeto vacío o un mensaje de error.
    res.status(401).json({ message: "Usuario no autenticado" });
  }
});
*/