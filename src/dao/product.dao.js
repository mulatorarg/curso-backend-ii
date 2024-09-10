import ProductoModel from "../models/producto.model.js";
//import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'

class ProductoDao {

  async addProduct({ code, nombre, precio, stock, categoria, thumbnails }) {
    try {

      if (!code || !nombre || !precio || !stock || !categoria) {
        console.log("Todos los campos son obligatorios.");
        return;
      }

      const existeProducto = await ProductoModel.findOne({ nombre: nombre });

      if (existeProducto) {
        console.log("Ya existe un producto con este código.");
        return;
      }

      const newProduct = new ProductoModel({
        code,
        nombre,
        precio,
        stock,
        categoria,
        activo: true,
        thumbnails: thumbnails || []
      });

      await newProduct.save();

    } catch (error) {
      console.log("Error al agregar producto: ", error);
      throw error;
    }
  }

  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      const skip = (page - 1) * limit;

      let queryOptions = {};

      if (query) {
        queryOptions = { categoria: query };
      }

      const sortOptions = {};
      if (sort) {
        if (sort === 'asc' || sort === 'desc') {
          sortOptions.precio = sort === 'asc' ? 1 : -1;
        }
      }

      const productos = await ProductoModel
        .find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalProducts = await ProductoModel.countDocuments(queryOptions);

      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: productos,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
        nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
      };
    } catch (error) {
      console.log("Error al obtener los productos", error);
      throw error;
    }
  }

  //Get product con query, para poder ordenar y filtrar productos.
  getProductsQuery = async (limit, page, sort, categoria) => {
    try {
      // Si no se proporciona un límite, se establece en 10 por defecto
      !limit && (limit = 9);
      // Si no se proporciona una página, se establece en 1 por defecto
      !page && (page = 1);
      // Si el ordenamiento es 'asc', se establece en 1
      sort === 'asc' && (sort = 1);
      // Si el ordenamiento es 'des', se establece en -1
      sort === 'des' && (sort = -1);

      // Se crea un filtro a partir de la consulta proporcionada, si no hay consulta, el filtro es un objeto vacío.
      //Ejemplo {"categoria": "una categoria"}
      const filter = categoria ? { categoria: categoria } : {};
      const queryOptions = { limit: limit, page: page, lean: true };

      if (sort === 1 || sort === -1) {
        queryOptions.sort = { price: sort };
      }

      //paginacion con sus propiedades para paginar:
      const getProducts = await ProductoModel.paginate(filter, queryOptions);
      getProducts.isValid = !(page <= 0 || page > getProducts.totalPages); // verificamos si el número de página proporcionado es válido y dentro del rango de páginas disponibles. Si no lo es, entonces getProducts.isValid se establecerá en falso.
      getProducts.prevLink =
        getProducts.hasPrevPage &&
        `?page=${getProducts.prevPage}&limit=${limit}`;
      getProducts.nextLink =
        getProducts.hasNextPage &&
        `?page=${getProducts.nextPage}&limit=${limit}`;

      getProducts.status = getProducts ? 'success' : 'error';

      return getProducts;
    } catch (error) {
      console.log(error.message);
    }
  };

  async getProductById(id) {
    try {
      const producto = await ProductoModel.findById(id);

      if (!producto) {
        console.log("Producto no encontrado");
        return null;
      }

      console.log("Producto encontrado!");
      return producto;
    } catch (error) {
      console.log("Error al traer un producto por id");
    }
  }

  async updateProduct(id, productoActualizado) {
    try {

      const updateado = await ProductoModel.findByIdAndUpdate(id, productoActualizado);

      if (!updateado) {
        console.log("Producto no encontrado.");
        return null;
      }

      console.log("Producto actualizado correctamente.");
      return updateado;
    } catch (error) {
      console.log("Error al actualizar el producto.", error);

    }
  }

  async deleteProduct(id) {
    try {
      const deleteado = await ProductoModel.findByIdAndDelete(id);

      if (!deleteado) {
        console.log("Producto no encontrado.");
        return null;
      }

      console.log("Producto eliminado correctamente.");
    } catch (error) {
      console.log("Error al eliminar el producto.", error);
      throw error;
    }
  }

}

export default new ProductoDao();
