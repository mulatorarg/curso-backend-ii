import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.render("admin-index");
  } catch (error) {
    res.status(500).send("Error al recuperar Productos.")
  }
});

router.get("/productos", (req, res) => {
  try {
    res.render("admin-productos");
  } catch (error) {
    res.status(500).send("Error al recuperar Productos.")
  }
});

router.get("/productos/abm", (req, res) => {
  res.render("admin-productos-abm");
});

export default router;
