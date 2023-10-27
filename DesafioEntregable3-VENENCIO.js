import fs from 'fs';

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async loadProducts() {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveProducts(products) {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf8');
    } catch (error) {
      throw new Error('Error al guardar productos.');
    }
  }

  async calculateNextId() {
    const products = await this.loadProducts();
    const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }

  async addProduct(product) {
    try {
      product.id = await this.calculateNextId();
      const products = await this.loadProducts();
      products.push(product);
      await this.saveProducts(products);
      return product.id;
    } catch (error) {
      throw new Error('Error al agregar producto.');
    }
  }

  async getProducts() {
    try {
      const products = await this.loadProducts();
      return products;
    } catch (error) {
      throw new Error('Error al obtener productos.');
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.id === parseInt(id));
      if (product) {
        return product;
      } else {
        throw new Error('Producto no encontrado.');
      }
    } catch (error) {
      throw new Error('Error al obtener producto por ID.');
    }
  }

  async updateProduct(id, newProductData) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((p) => p.id === id);
      if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...newProductData };
        await this.saveProducts(products);
        return true;
      } else {
        throw new Error('Producto no encontrado.');
      }
    } catch (error) {
      throw new Error('Error al actualizar producto.');
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((p) => p.id === id);
      if (productIndex !== -1) {
        products.splice(productIndex, 1);
        await this.saveProducts(products);
        return true;
      } else {
        throw new Error('Producto no encontrado.');
      }
    } catch (error) {
      throw new Error('Error al eliminar producto.');
    }
  }
}

export default ProductManager;
