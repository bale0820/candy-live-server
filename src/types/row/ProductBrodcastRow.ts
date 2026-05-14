import { RowDataPacket } from "mysql2";

export interface ProductBrodcastRow extends RowDataPacket {
    
    id: number;

    product_id: number;

    streamer_id: number;

    title: string;

    room_id: string;

    thumbnail: string | null;

    is_live: boolean;

    started_at: Date;

    ended_at: Date | null;

    created_at: Date;

    updated_at: Date;
}