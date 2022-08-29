import { Schema, model } from "mongoose";

import { MessageInterface } from "../interfaces";


const MessageSchema = new Schema<MessageInterface<Schema.Types.ObjectId>>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const MessageModel = model("Message", MessageSchema);