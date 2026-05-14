import { liveService } from "@/service/liveService";
import { Request, Response }
    from "express";


export const liveController = {

    start:
        async (
            req: Request,
            res: Response
        ) => {

            try {

                const {
                    roomId,
                    productId,
                    title,
                    thumbnail
                } = req.body;
                console.log("들어옴");
                const user =
                    (req as any).user as {
                        id: number;
                    };

                if (!user) {

                    return res.status(401).json({
                        message: "로그인 필요"
                    });

                }

                const liveId =
                    await liveService.start(
                        {
                            roomId,
                            productId,
                            title,
                            streamerId:
                                user.id,
                            thumbnail
                        }
                    );

                res.json({
                    id: liveId
                });

            } catch (err) {

                console.log(err);

                res.status(500).json({
                    message:
                        "방송 생성 실패"
                });

            }

        }

};