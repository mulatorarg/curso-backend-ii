import CartModel from "../models/cart.model.js";

class CartDao {
  async crearCarrito() {
    try {
      const nuevoCarrito = new CartModel({ productos: [] });
      await nuevoCarrito.save();
      return nuevoCarrito;
    } catch (error) {
      console.log("Error al crear el nuevo carrito.");
      return null;
    }
  }

  async getCarritoById(cartId) {
    try {
      const carrito = await CartModel.findById(cartId);
      if (!carrito) {
        console.log("No existe ese carrito con el id");
        return null;
      }

      return carrito;
    } catch (error) {
      console.log("Error al traer el carrito, fijate bien lo que haces", error);
      return null;
    }
  }

  async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
    try {
      const carrito = await this.getCarritoById(cartId);
      const existeProducto = carrito.productos.find(item => item.producto.toString() === productId);

      if (existeProducto) {
        existeProducto.quantity += quantity;
      } else {
        carrito.productos.push({ producto: productId, quantity });
      }

      //Vamos a marcar la propiedad "productos" como modificada antes de guardar:
      carrito.markModified("productos");

      await carrito.save();
      return carrito;

    } catch (error) {
      console.log("error al agregar un producto", error);
      return null;
    }
  }

}

export default CartDao;
