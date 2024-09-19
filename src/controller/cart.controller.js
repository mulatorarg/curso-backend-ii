import config from "../config/config.js";
import CartDao from "../dao/cart.dao.js";

const cartDao = new CartDao();

class CartController {

  async addProductToCart(req, res) {
    try {
      if (req.user.role !== "user") res.redirect("/sinpermisos");

      const carrito_id = req.user.cart;
      if (carrito_id) {
        const producto_id = req.params.producto_id;

        cartDao.addProductToCart(carrito_id, producto_id, 1);

        res.redirect("/cart");
      } else {
        res.redirect("/login")
      }
    } catch (error) {
      res.status(500).send("Error al agregar el Producto a tu carrito." + error)
    }
  }
}

export default new CartController();
