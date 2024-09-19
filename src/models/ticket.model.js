import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  purchase_datetime: { type: Date, default: Date.now },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  purchaser: {
    type: String,
    required: true
  },
});

const TicketModel = mongoose.model("tickets", ticketSchema);

export default TicketModel;
