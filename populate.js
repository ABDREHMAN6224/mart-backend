import { data } from "./initialData.js";
import Product from "./models/productModel.js";

export const populate = async () => {
    await Product.deleteMany({}).then(() => { console.log("done delete"); })
    Product.create(data).then(() => { console.log("added data"); })
}