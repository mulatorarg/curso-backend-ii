import CartModel from "../models/cart.model.js";

class CartDao {

  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log("Error al crear el nuevo carrito.");
      return null;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        console.log("No existe ese carrito con el id");
        return null;
      }

      return cart;
    } catch (error) {
      console.log("Error al traer el carrito, fijate bien lo que haces", error);
      return null;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const existeProducto = cart.products.find(item => item.product.toString() === productId);

      if (existeProducto) {
        existeProducto.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      console.log("Error al agregar un producto", error);
      return null;
    }
  }

}

export default CartDao;
