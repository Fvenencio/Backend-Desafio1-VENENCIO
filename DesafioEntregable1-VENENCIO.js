class ProductManager {
    constructor() {
      this.products = [];
      this.productIdCounter = 1;
    }
  
    addProduct(product) {
      if (this.isProductValid(product)) {
        product.code = this.productIdCounter++;
        this.products.push(product);
        return product.code;
      }
    }
  
    isProductValid(product) {
      const requiredFields = ['title', 'description', 'price', 'thumbnail' , 'stock'];
  
      for (const field of requiredFields) {
        if (!product.hasOwnProperty(field) || !product[field]) {
          console.log(`Error: El campo "${field}" es obligatorio.`);
          return false;
        }
      }
  
      if (this.products.some(existingProduct => existingProduct.code === product.code)) {
        console.log(`Error: El código "${product.code}" ya está en uso.`);
        return false;
      }
  
      return true;
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find(product => product.code === id);
  
      if (product) {
        return product;
      } else {
        console.log('Error: Producto no encontrado.');
      }
    }
  }
  
  // Ejemplo de uso:
  const productManager = new ProductManager();
  
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
  