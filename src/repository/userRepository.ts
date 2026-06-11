
// import { RowDataPacket } from "mysql2";
// import { promisePool as db } from "../config/db";

// export interface UserRow extends RowDataPacket {
//   id: number;

//   role?: string;

//   user_id: string;     // 로그인 아이디
//   name: string;
//   email: string;
//   password: string;

//   phone?: string;
//   gender?: string;
//   birthday?: string;
//   address?: string;

//   provider?: string;  // 기본값 "local"
//   recommendation?: string;
//   zonecode?: string;
// }


// export const userRepository = {
//     findById :  async(id : number) : Promise<string> => {
//     const [rows] = await db.query<UserRow[]>(`select * from users where id = ?`,[id]);
//     const name = rows[0].name;
//     return name;
// }
// }
import { promisePool as db } from "../config/db";

export interface UserRow {
  id: number;

  role?: string;

  user_id: string;
  name: string;
  email: string;
  password: string;

  phone?: string;
  gender?: string;
  birthday?: string;
  address?: string;

  provider?: string;
  recommendation?: string;
  zonecode?: string;
}

export const userRepository = {

    findById:
        async (
            id: number
        ): Promise<string> => {

            const result =
                await db.query(
                    `
                    select *
                    from users
                    where id = $1
                    `,
                    [id]
                );

            const rows =
                result.rows as UserRow[];

            if (rows.length === 0) {
                throw new Error("사용자를 찾을 수 없습니다.");
            }

            return rows[0].name;
        }

}