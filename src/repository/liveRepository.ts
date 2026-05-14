import { ResultSetHeader }
    from "mysql2";

import { promisePool }
    from "@/config/db";

interface CreateLiveDto {

    roomId: string;

    productId: number;

    title: string;

    streamerId: number;

    thumbnail : string;

}

export const liveRepository = {

    create:
        async (
            data: CreateLiveDto
        ) => {

            const [result] =
                await promisePool.query<ResultSetHeader>(
                    `
                    INSERT INTO live_broadcast
                    (
                        product_id,
                        streamer_id,
                        title,
                        room_id,
                        thumbnail
                    )
                    VALUES
                    (?, ?, ?, ?, ?)
                    `,
                    [
                        data.productId,
                        data.streamerId,
                        data.title,
                        data.roomId,
                        data.thumbnail
                    ]
                );

            return result.insertId;

        }

};