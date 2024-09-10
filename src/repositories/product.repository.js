import ProductDao from "../dao/product.dao.js";

class ProductRepository {

  async createProduct(productData) {
    return await ProductDao.save(productData);
  }

  async getProductById(id) {
    return await ProductDao.findById(id);
  }

}

export default new ProductRepository();
