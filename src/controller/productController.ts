import { productService } from "@/service/productService";
import { NextFunction, Request, Response } from "express";

export const productController = {
    getProductBrodcastList: async (req: Request, res: Response, next: NextFunction
    ) => {
        try {
             const ppk = req.params.ppk as string;

             if(!ppk) {
                throw new Error("no ppk");
             }
            const data = await productService.getProductBrodcastList(ppk);

            res.status(200).json(data);
        } catch (err) {
            next(err);
        }

    },
}