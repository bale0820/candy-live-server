import mongoose from "mongoose";

export const connectMongo = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URL!);

        console.log("mongo connected");

    } catch (err) {

        console.log(err);

    }

};