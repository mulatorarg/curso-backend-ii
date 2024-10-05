import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

class CartDao {

  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart.lean();
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
      const productToAdd = await ProductModel.findOne({ _id: productId });
      const productIndex = cart.products.findIndex(item => item.product._id.toString() == productId);

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
        cart.products[productIndex].price = productToAdd.price;
      } else {
        cart.products.push({ product: productToAdd, quantity, price: productToAdd.price });
      }

      await cart.save();

    } catch (error) {
      console.log("Error al agregar un producto", error);
      return null;
    }
  }

}

export default CartDao;
