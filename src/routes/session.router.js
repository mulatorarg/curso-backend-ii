import { Router } from "express";
import { passportCall } from "../util/util.js";
import userController from "../controller/user.controller.js";

const router = Router();

// Ruta que procesa el Registro de un Usuario
router.post("/register", userController.register)

// Ruta que procesa el Inicio de Sesión
router.post("/login", userController.login);

// Ruta para controlar si está logueado el usuario
router.get("/current", passportCall("jwt"), userController.current);

// Ruta para cerrar sesión
router.post("/logout", userController.logout);

export default router;
