import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    res.render("admin-index");
  } catch (error) {
    res.status(500).send("Error al recuperar Productos.")
  }
});

router.get("/productos", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    res.render("admin-productos");
  } catch (error) {
    res.status(500).send("Error al recuperar Productos.")
  }
});

router.get("/productos/abm", passport.authenticate("jwt", { session: false }), async (req, res) => {
  res.render("admin-productos-abm");
});

export default router;
