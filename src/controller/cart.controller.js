import CartDao from "../dao/cart.dao.js";

const cartDao = new CartDao();

class CartController {

  async showCart(req, res) {
    try {
      if (req.user.role !== "user") {
        res.redirect("/sinpermisos");
        console.log('Ver Carrito: Sin Permisos.');
        return;
      }

      const titulo = "🛒 Tu Carrito de compras";
      const categorias = await ProductModel.distinct("category").lean();

      const carrito_id = req.user.cart;
      const carrito = await cartDao.getCartById(carrito_id);

      let productos = [];
      if (carrito) productos = carrito.products;

      console.log(productos);

      res.render("cart", { productos, categorias, titulo });
    } catch (error) {
      res.status(500).send("Error al recuperar tu carrito: " + error)
    }
  }

  async showProduct(req, res) {
    try {
      if (req.user.role !== "user") {
        res.redirect("/sinpermisos");
        console.log('Ver Producto: Sin Permisos.');
        return;
      }

      const carrito_id = req.user.cart;
      if (carrito_id) {
        const producto_id = req.params.producto_id ?? '';
        const titulo = "Datos Producto";
        const producto = await ProductModel.findById(producto_id).lean();
        const categorias = await ProductModel.distinct("category").lean();
        res.render("product", { producto, categorias, titulo, carrito_id });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      res.status(500).send("Error al recuperar Producto.")
    }
  }

  async addProductToCart(req, res) {
    try {

      if (req.user.role !== "user") {
        console.log('addProductToCart', 'Sin permiso');
        res.redirect("/sinpermisos");
        return;
      }

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
