import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  total: {
    type: Number,
    required: true,
    default: 0
  }
});

const CartModel = mongoose.model("tickets", cartSchema);

export default CartModel;
