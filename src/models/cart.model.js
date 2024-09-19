import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 0
      },
      price: {
        type: Number,
        required: true,
        default: 0
      }
    }
  ]
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;
