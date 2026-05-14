import { liveRepository } from "@/repository/liveRepository";


interface StartLiveDto {

    roomId: string;

    productId: number;

    title: string;

    streamerId: number;

    thumbnail : string;

}

export const liveService = {

    start:
        async (
            data: StartLiveDto
        ) => {

            // 나중에:
            // 중복 방송 체크
            // 방송 제한
            // validation

            const liveId =
                await liveRepository.create(
                    data
                );

            return liveId;

        }

};