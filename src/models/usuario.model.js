import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts',
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }
});

const UsuarioModel = mongoose.model("usuarios", usuarioSchema);

export default UsuarioModel;
