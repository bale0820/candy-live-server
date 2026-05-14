import { productController } from "@/controller/productController";
import { Router } from "express";

const router = Router();

router.get('/:ppk', productController.getProductBrodcastList);
export const  productRoutes = router;