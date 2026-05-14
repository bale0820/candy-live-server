import "express";

// declare module "express-serve-static-core" {
//   interface Request {
//     user?: {
//       id: number;
//     };
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      };
    }
  }
}

export {}; 