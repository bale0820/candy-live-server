import { productRepository } from "@/repository/productRepository";
import { ProductBrodcast } from "@/types/domain/ProductBrodcast";

export const productService = {
    getProductBrodcastList: async (ppk : string): Promise<ProductBrodcast[]> => {
        const data = await productRepository.findBrodcastListByPpk(ppk);
        return data;
    },

}