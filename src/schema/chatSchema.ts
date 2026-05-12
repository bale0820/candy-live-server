import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({

    roomId: {
        type: String,
        required: true
    },

    userPk: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

export const Chat = mongoose.model(
    "Chat",
    chatSchema
);