import React from "react";
import { Route } from "react-router-dom";

import { ChatPage } from "../pages/chat/chat.page";


export const chatNavigator = (
  <Route path="/" element={<ChatPage />} />
);

