import mongoose from "mongoose";

export const productoSchema = new mongoose.Schema({
  codigo: String,
  nombre: String,
  descripcion: String,
  precio: Number,
  categoria: String,
  stock: {
    type: Number,
    required: true,
    default: 1
  },
  destacado: {
    type: Boolean,
    default: false
  },
});

const ProductoModel = mongoose.model("productos", productoSchema);

export default ProductoModel;
