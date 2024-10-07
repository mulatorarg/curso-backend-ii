import CartDao from "../dao/cart.dao.js";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";
import config from "../config/config.js";
import UserModel from "../models/user.model.js";
import TicketModel from "../models/ticket.model.js";
import { generarClaveAleatoria, calcularTotal } from "../util/util.js";

const cartDao = new CartDao();

class ViewsController {

  async index(req, res) {
    try {
      const titulo = "Todos nuestros Productos";
      const productos = await ProductModel.find({ active: true }).lean();
      const categorias = await ProductModel.distinct("category").lean();
      res.render("store", { productos, categorias, titulo });
    } catch (error) {
      const message = 'Error al recuperar Productos Activos.';
      res.render("error", { message });
    }
  }

  async destacados(req, res) {
    try {
      const titulo = "Productos Destacados";
      const productos = await ProductModel.find({ important: true, active: true }).lean();
      const categorias = await ProductModel.distinct("category").lean();
      res.render("store", { productos, categorias, titulo });
    } catch (error) {
      const message = 'Error al recuperar Productos Destacados.';
      res.render("error", { message });
    }
  }

  async porcategoria(req, res) {
    try {
      const category = req.params.category ?? '';
      const titulo = "Productos por Categoria";
      const productos = await ProductModel.find({ active: true, category: category }).lean();
      const categorias = await ProductModel.distinct("category").lean();
      res.render("store", { productos, categorias, titulo });
    } catch (error) {
      const message = 'Error al recuperar Categorias.';
      res.render("error", { message });
    }
  }

  async login(req, res) {
    //si tiene token, está logueado
    if (req.cookies[config.COOKIE_NAME]) {
      res.redirect("/api/sessions/current"); //esta ruta controla si token es correcto...
    } else {
      res.render("login");
    }
  }

  async register(req, res) {
    res.render("register");
  }

  async sinpermiso(req, res) {
    res.render("sinpermisos");
  }

  async realtimeproducts(req, res) {
    if (req.user.role !== "admin") {
      res.redirect("/sinpermisos");
      console.log('RealtimeProducts: Sin Permisos.');
      return;
    }
    try {
      const titulo = "Productos en tiempo real 😏";
      const productos = await ProductModel.find({ active: true }).lean();
      const categorias = await ProductModel.distinct("category").lean();
      res.render("realtimeProducts", { productos, categorias, titulo });
    } catch (error) {
      const message = 'Error al recuperar Productos para Tiempo Real.';
      res.render("error", { message });
    }
  }

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
      const carrito = await CartModel.findById(carrito_id).lean();

      let productos = [];
      if (carrito) productos = carrito.products;

      res.render("cart", { productos, categorias, titulo });
    } catch (error) {
      const message = 'Error al recuperar tu carrito: ' + error.message;
      res.render("error", { message });
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
      const message = 'Error al recuperar Producto.';
      res.render("error", { message });
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

        await cartDao.addProductToCart(carrito_id, producto_id, 1);

        res.redirect("/cart");
      } else {
        res.redirect("/login")
      }
    } catch (error) {
      const message = 'Error al agregar el Producto a tu carrito. ' + error.message;
      res.render("error", { message });
    }
  }

  async finishCart(req, res) {

    try {

      if (req.user.role !== "user") {
        console.log('addProductToCart', 'Sin permiso');
        res.redirect("/sinpermisos");
        return;
      }

      const cartId = req.user.cart;
      const cart = await CartModel.findById(cartId);


      const products = cart.products;
      const productsNoStock = [];

      products.forEach(async (item) => {
        const productId = item.product;
        const product = await ProductModel.findById(productId);
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
        } else {
          productsNoStock.push(item);
        }
      });

      //console.log(cart.products);

      cart.products = cart.products.filter(
        item => productsNoStock.some(
          productoId => productoId.equals(item.product)
        )
      );
      await cart.save();

      //console.log(cart.products);

      const cartUser = await UserModel.findOne({ cart_id: cartId });
      const ticket = new TicketModel({
        code: 'TICKET-' + generarClaveAleatoria(),
        purchase_datetime: new Date(),
        amount: calcularTotal(cart.products),
        purchaser: cartUser.email,
      });

      await ticket.save();

      const titulo = '🎉 Gracias por tu compra';
      const code = ticket.code;

      res.render("cartFinished", { titulo, code, productsNoStock });
    } catch (error) {
      const message = 'Error al Finalizar el carrito: ' + error;
      res.render("error", { message });
    }
  }

}

export default new ViewsController();
