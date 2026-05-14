
import { RowDataPacket } from "mysql2";
import { promisePool as db } from "../config/db";
import { ProductBrodcastRow } from "@/types/row/ProductBrodcastRow";
import { ProductBrodcast } from "@/types/domain/ProductBrodcast";
import { toCamel } from "@/utils/tocamel";




export const productRepository = {
    findBrodcastListByPpk :  async(ppk : string) : Promise<ProductBrodcast[]> => {
    const [rows] = await db.query<ProductBrodcastRow[]>(`select * from live_broadcast where product_id = ?`,[ppk]);
    

    return rows.map((row) => toCamel<ProductBrodcast>(row));
}
}