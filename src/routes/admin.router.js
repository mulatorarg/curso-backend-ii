import { Router } from "express";
import { passportCall, authorization } from "../util/util.js";

const router = Router();

router.get("/", passportCall("jwt"), authorization("admin"), async (req, res) => {
  try {
    res.render("admin-index");
  } catch (error) {
    res.status(500).send("Error al recuperar Productos.")
  }
});

router.get("/productos", passportCall("jwt"), authorization("admin"), async (req, res) => {
  try {
    res.render("admin-productos");
  } catch (error) {
    res.status(500).send("Error al recuperar Productos.")
  }
});

router.get("/productos/abm", passportCall("jwt"), authorization("admin"), async (req, res) => {
  res.render("admin-productos-abm");
});

export default router;
