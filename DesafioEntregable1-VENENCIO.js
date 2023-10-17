const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]', 'utf8'); // Crea un archivo JSON vacío si no existe.
    }
    this.products = this.loadProducts();
    this.productIdCounter = this.calculateNextId();
  }

  loadProducts() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2), 'utf8');
  }

  calculateNextId() {
    const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }

  addProduct(product) {
    product.id = this.productIdCounter++;
    this.products.push(product);
    this.saveProducts();
    return product.id;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      return product;
    } else {
      console.log('Error: Producto no encontrado.');
    }
  }

  updateProduct(id, newProductData) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...newProductData };
      this.saveProducts();
      return true;
    } else {
      console.log('Error: Producto no encontrado.');
      return false;
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveProducts();
      console.log('Producto eliminado con éxito.');
    } else {
      console.log('Error: Producto no encontrado.');
    }
  }
}

const productManager = new ProductManager('products.json');

const product1 = {
  title: 'Iphone 13',
  description: 'Teléfono inteligente de gama alta desarrollado por Apple Inc',
  price: 1299,
  thumbnail: 'imagen1.jpg',
  stock: 46,
};

const product2 = {
  title: 'iphone 14',
  description: 'Igualado en especificaciones con el 13, pero con una mayor autonomía y mejores cámaras',
  price: 1499,
  thumbnail: 'imagen2.jpg',
  stock: 38,
};

const productCode1 = productManager.addProduct(product1);
const productCode2 = productManager.addProduct(product2);

console.log('Lista de productos:', productManager.getProducts());
console.log('Producto con código 1:', productManager.getProductById(productCode1));
console.log('Producto con código 3:', productManager.getProductById(3));
