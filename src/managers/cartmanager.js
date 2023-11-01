import fs from "fs";

class CartManager {
    #carts = [];
    #id = 0;
    constructor(path, collectionName) {
        this.path = path;
        this.name = collectionName;
        console.log(`Instancia de Cart Manager ${this.name} creada`);
        this.init();
    }

    async init() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8");
                this.#carts = JSON.parse(data);
                this.#id =
                    this.#carts.length != 0 ? this.#carts[this.#carts.length - 1].id : 0;
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
            await fs.promises.writeFile(this.path, JSON.stringify(this.#carts));
            console.log(`Archivo ${this.path} correctamente guardado`);
        } catch (error) {
            console.log(`Error al crear el archivo ${this.path}
                   Error. ${error}`);
        }
    }

    async createCart() {
        this.#id++;
        const cart = { id: this.#id, products: [] };
        this.#carts.push(cart);
        await this.write();
        return cart;
    }

    getCarts() {
        return this.#carts;
    }

    getCartById(cid) {
        const cart = this.#carts.find((cart) => cart.id == cid);
        return cart ? cart : "No encontrado";
    }

    async addProductsToCart(cid, product) {
        if (Object.keys(product).length === 0) {
            return "No hay nada para actualizar, faltan productos";
        }


        if (!product.pid || !product.quantity) {
            return "Faltan datos en el producto"
        }

        const cart_index = this.#carts.findIndex((cart) => cart.id == cid);
        if (cart_index === -1) {
            return "Carrito no encontrado"
        }

        const product_index = this.#carts[cart_index].products.findIndex(
            (prod) => prod.pid == product.pid
        );
        if (product_index === -1) {
            this.#carts[cart_index].products.push(product);
            await this.write();
            return this.#carts[cart_index];
        } else {
            this.#carts[cart_index].products[product_index].quantity +=
                product.quantity;
            await this.write();
            return this.#carts[cart_index];
        }
    }

    async deleteProductFromCart(cid, product) {
        if (!product.pid) {
            return "Faltan datos en el producto para eliminar";
        }
        const cart_index = this.#carts.findIndex((cart) => cart.id == cid);
        if (cart_index === -1) {
            return "Cart not found";
        }

        const product_index = this.#carts[cart_index].products.findIndex(
            (prod) => prod.pid == product.pid
        );
        if (product_index === -1) {
            return "Producto no encontrado en el carrito";
        } else {
            if (!product.quantity) {
                this.#carts[cart_index].products.splice(product_index, 1);
                await this.write();
                return this.#carts[cart_index];
            } else {
                this.#carts[cart_index].products[product_index].quantity -=
                    product.quantity;
                await this.write();
                return this.#carts[cart_index];
            }
        }
    }

    async deleteCart(cid) {
        const index = this.#carts.findIndex((cart) => cart.id == cid);
        if (index === -1) {
            return "No encontrado";
        }

        try {
            this.#carts.splice(index, 1);
            await this.write();
            return "Carrito eliminado";
        } catch (error) {
            console.log(`Error al eliminar el carrito con id:${id}
                   Error. ${error}`);
        }
    }
}

export default CartManager;