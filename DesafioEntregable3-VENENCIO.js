import fs from 'fs';

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async loadProducts() {
    try {
      if (await fs.access(this.filePath)) {
        const data = await fs.readFile(this.filePath, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  async saveProducts() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2), 'utf8');
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
    product.id = await this.calculateNextId();
    this.products.push(product);
    await this.saveProducts();
    return product.id;
  }

  async getProducts() {
    this.products = await this.loadProducts();
    return this.products;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = await productManager.getProductByIdAsync(parseInt(id));
    if (product) {
      return product;
    } else {
      throw new Error('Producto no encontrado.');
    }
  }

  async updateProduct(id, newProductData) {
    const products = await this.getProducts();
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...newProductData };
      await this.saveProducts();
      return true;
    } else {
      throw new Error('Producto no encontrado.');
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      await this.saveProducts();
      return true;
    } else {
      throw new Error('Producto no encontrado.');
    }
  }
}

export default ProductManager
