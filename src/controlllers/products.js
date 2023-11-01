import ProductManager from "../managers/productsmanager.js";

export const productos = new ProductManager( "./src/db/iphone.json", "iphone" );
