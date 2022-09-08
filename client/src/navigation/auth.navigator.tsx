import React from "react";
import { Route } from "react-router-dom";

import { AuthPage } from "../pages/auth/auth.page";

export const authNavigator = (
 <Route path="/auth" element={<AuthPage />} />
);
