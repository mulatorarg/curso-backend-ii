import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
  nombre: String,
  activo: {
    type: Boolean,
    default: true
  },
});

const CategoriaModel = mongoose.model("categorias", categoriaSchema);

export default CategoriaModel;
