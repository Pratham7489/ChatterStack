import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        mediaType: {
            type: String,
            enum: ["image", "video"],
            default: null,
        },
        mediaUrl: {
           type: String, 
        },
        mediaUrlPublicId: {
           type: String, 
        },
        editedAt: {
           type: Date,
           default: null,
        },
        deletedBy: [{
           type: mongoose.Schema.Types.ObjectId,
           ref: "User",
        }],
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;