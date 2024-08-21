import mongoose from "mongoose";
import { productoSchema } from "./producto.model.js";

export const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true
  },
  password: String,
  first_name: String,
  last_name: String,
  age: Number,
  cart: productoSchema,
  rol: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  activo: {
    type: Boolean,
    default: true
  },
});

const UsuarioModel = mongoose.model("usuarios", usuarioSchema);

export default UsuarioModel;
