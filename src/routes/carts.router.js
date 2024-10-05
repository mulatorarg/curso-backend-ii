import { Router } from "express";
import CartModel from "../models/cart.model.js";
import CartDao from "../dao/cart.dao.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import TicketModel from "../models/ticket.model.js";
import { calcularTotal, generarClaveAleatoria } from "../util/util.js";

const router = Router();

// Crear un nuevo carrito:
router.post("/", async (req, res) => {
  try {
    const newCart = await CartDao.crearCarrito();
    res.json(newCart);
  } catch (error) {
    console.error("Error al crear un nuevo carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//  Listar productos que pertenecen a determinado carrito.
router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carrito = await CartModel.findById(cartId)

    if (!carrito) {
      console.log("No existe ese carrito con el id");
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    // retornar solo los productos del carrito
    return res.json(carrito.products);
  } catch (error) {
    console.error("Error al obtener el carrito.");
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// Agregar producto al carrito pasado por parámetro.
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const actualizarCarrito = await CartDao.agregarProductoAlCarrito(cartId, productId, quantity);
    res.json(actualizarCarrito.products);
  } catch (error) {
    console.error("Error al agregar producto al carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// realizar la compra.
router.post("/:cid/purchase", async (req, res) => {
  const cartId = req.params.cid;

  //try {
    const cart = await CartModel.findById(cartId);
    const products = cart.products;
    const productsNoStock = [];

    products.forEach(async (item) => {
      const productId = item.product;
      const product = await ProductModel.findById(productId);
      if(product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
      } else {
        productsNoStock.push(productId);
      }
    });

    cart.products = cart.products.filter(
      item => productsNoStock.some(
        productoId => productoId.equals(item.product)
      )
    );
    await cart.save();

    const cartUser = await UserModel.findOne({cart_id: cartId});
    const ticket = new TicketModel({
      code: 'TICKET-' + generarClaveAleatoria(),
      purchase_datetime: new Date(),
      amount: calcularTotal(cart.products),
      purchaser: cartUser.email,
    });

    await ticket.save();

    res.status(200).json({
      message: 'Compra generada correctamente.',
      ticket: {
        id: ticket._id,
        code: ticket.code,
        amount: ticket.amount,
        purchaser: ticket.purchaser
      },
      productsNoStock,
    });

  //} catch (error) {
  //  console.error("Error al completar la compra.", error.message);
  //  res.status(500).json({ error: "Error interno del servidor" });
  //}
});

export default router;
