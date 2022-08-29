import { Schema, model } from "mongoose";

import { ChatInterface } from "../interfaces";


const ChatSchema = new Schema<ChatInterface<Schema.Types.ObjectId>>(
  {
      chatName: { type: String, trim: true },
      isGroupChat: { type: Boolean, default: false },
      users: [{ type: Schema.Types.ObjectId, ref: "User" }],
      latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      },
      groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const ChatModel = model("Chat", ChatSchema);
