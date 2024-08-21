import mongoose from "mongoose";

export const cartSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  activo: {
    type: Boolean,
    default: true
  },
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;
