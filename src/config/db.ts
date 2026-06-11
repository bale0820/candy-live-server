// // const mysql = require('mysql2/promise');
// // const mysql = require('mysql2/promise');
// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,

//     typeCast: function (field, next) {
//         if (field.type === 'BIT' && field.length === 1) {
//             const bytes = field.buffer();
//             return bytes ? bytes[0] === 1 : false;
//         }

//         return next();
//     }
// });

// export const promisePool = pool;

import { Pool } from "pg";

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
});

export const promisePool = pool;