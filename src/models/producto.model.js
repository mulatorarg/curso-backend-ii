import mongoose from "mongoose";

export const productoSchema = new mongoose.Schema({
  codigo: String,
  nombre: String,
  descripcion: String,
  precio: Number,
  categoria: String,
  destacado: {
    type: Boolean,
    default: false
  },
  activo: {
    type: Boolean,
    default: true
  },
});

const ProductoModel = mongoose.model("productos", productoSchema);

export default ProductoModel;
