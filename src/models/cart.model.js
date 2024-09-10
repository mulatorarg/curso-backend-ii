import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productos",
        required: true
      },
      cantidad: {
        type: Number,
        required: true,
        default: 0
      },
      precio: {
        type: Number,
        required: true,
        default: 0
      }
    }
  ]
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;
