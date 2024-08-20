import { Router } from "express";
const router = Router();
import UsuarioModel from "../models/usuario.model.js";
import { createHash, isValidPassword } from "../util/util.js";
import passport from "passport";
import jwt from "jsonwebtoken";

// Ruta que procesa el Registro de un Usuario
router.post("/register", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    //Verifico si ya existe el usuario
    const existeUsuario = await UsuarioModel.findOne({ usuario });
    if (existeUsuario) {
      return res.status(400).send("El usuario ya existe");
    }

    //Creo el nuevo
    const nuevoUsuario = new UsuarioModel({
      usuario,
      password: createHash(password)
    });

    //Lo guardo
    await nuevoUsuario.save();

    //Genero el token de JWT
    const token = jwt.sign({ usuario: nuevoUsuario.usuario, rol: nuevoUsuario.rol }, "coderShopSecreto", { expiresIn: "1h" });

    //Genero la cookie
    res.cookie("coderShopToken", token, {
      maxAge: 3600000,
      httpOnly: true
    });

    // Redirecciono a
    res.redirect("/api/sessions/current");
  } catch (error) {
    res.status(500).send("Hubo un Error interno del servidor.");
  }
})

// Ruta que procesa el Inicio de Sesión
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    //Verifico si el usuario ya existe
    const usuarioEncontrado = await UsuarioModel.findOne({ usuario });

    if (!usuarioEncontrado) {
      return res.status(401).send("Usuario no existe.");
    }

    if (!isValidPassword(password, usuarioEncontrado)) {
      return res.status(401).send("Password incorrecto.");
    }

    //Genero el token de JWT
    const token = jwt.sign({ usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol }, "coderShopSecreto", { expiresIn: "1h" });

    //Genero la cookie
    res.cookie("coderShopToken", token, {
      maxAge: 3600000,
      httpOnly: true
    });

    res.redirect("/api/sessions/current");
  } catch (error) {
    res.status(500).send("Hubo un Error interno del servidor.");
  }
});

// Ruta para controlar si está logueado el usuario
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (req.user) {
    res.render("home", { usuario: req.user.usuario });
  } else {
    res.status(401).send("Acceso denegaso. No haz iniciado sesión.");
  }
});

// Ruta exclusiva para admins
router.get("/admin", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (req.user.rol !== "admin") {
    return res.status(403).send("Acceso denegado. No posees privilegios necesatios.");
  }
  res.render("admin");
});

// Ruta para cerrar sesión
router.post("/logout", (req, res) => {
  res.clearCookie("coderShopToken");
  res.redirect("/login");
});

export default router;
