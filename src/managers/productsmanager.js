import fs from "fs";

class ProductManager {
  #products = [];
  #id = 0;
  constructor(path, collectionName) {
    this.path = path;
    this.name = collectionName;
    console.log(`Instancia de Product Manager ${this.name} creada`);
    this.init();
  }

  async init() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        this.#products = JSON.parse(data);
        this.#id =
          this.#products.length != 0
            ? this.#products[this.#products.length - 1].id
            : 0;

        console.log(`Archivo ${this.path} correctamente cargado`);
        return;
      } else await this.write();
    } catch (error) {
      console.log(`Error al leer el archivo ${this.path}
                   Error. ${error}`);
    }
  }

  async write() {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.#products));
      console.log(`Archivo ${this.path} correctamente guardado`);
    } catch (error) {
      console.log(`Error al crear el archivo ${this.path}
                   Error. ${error}`);
    }
  }

  async addProduct(data) {
    if (
      !data.title ||
      !data.description ||
      !data.code ||
      !data.price ||
      !data.stock ||
      !data.category
    ) {
      return "Campos faltantes";
    }
    const codeCheck = this.#products.some((prod) => prod.code === data.code);
    if (codeCheck) {
      return "Codigo invalido o repetido";
    }
    if (!data.status === null || data.status === undefined) {
      data.status = true;
    }
    if (!data.thumbnails === null || data.thumbnails === undefined) {
      data.thumbnails = [];
    }

    this.#id++;
    const product = { id: this.#id, ...data };
    this.#products.push(product);
    await this.write();
    return product;
  }

  getProducts() {
    return this.#products;
  }

  getProductById(id) {
    const product = this.#products.find((product) => product.id == id);
    return product ? product : "No encontrado";
  }

  async updateProduct(id, data) {
    if (Object.keys(data).length === 0) {
      return "No hay nada para actualizar, faltan campos";
    }

    if (data.id != null || data.id != undefined) {
      delete data.id;
    }
    const product = this.#products.find((prod) => prod.id == id);
    if (!product) {
      return "No encontrado";
    }

    try {
      Object.keys(data).forEach((item) => {
        product[item] = data[item];
      });
      await this.write();
      return product;
    } catch (error) {
      console.log(`Error al actualizar el producto con id:${id}
                   Error. ${error}`);
    }
  }

  async deleteProduct(id) {
    const index = this.#products.findIndex((prod) => prod.id == id);
    if (index === -1) {
      return "No encontrado";
    }

    try {
      this.#products.splice(index, 1);
      await this.write();
      return "Producto eliminado";
    } catch (error) {
      console.log(`Error al eliminar el producto con id:${id}
                   Error. ${error}`);
    }
  }
}

export default ProductManager;