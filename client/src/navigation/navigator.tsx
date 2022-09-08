import React, { useEffect } from "react";
import { Routes, useLocation, useNavigate } from "react-router-dom";

import { setIsloading, setUserData, initialState } from "../redux/user/user.slice";

import { useAppDispatch, useAppSelector } from "../hooks/store.hooks";
import { useLocalStorage } from "../hooks/use-local-storage.hook";

import { authNavigator } from "./auth.navigator";
import { chatNavigator } from "./chat.navigator";

export function Navigator() {
    // react router dom hooks
  const navigate = useNavigate();
  const loacation = useLocation();
  // redux hooks
  const token = useAppSelector(state => state.user.token);
  const isLoading = useAppSelector(state => state.user.isLoading);
  const dispatch = useAppDispatch();

  const pathname = loacation.pathname; // current path

  const protectedRoutes = ["/", "/me", "/users", "/chat-detail"];
  const authRoutes = ["/auth"];

  
  const [userData, _] = useLocalStorage("userData", null);

  useEffect(() => {
    userData
      ? dispatch(setUserData(userData))
      : protectedRoutes.includes(pathname) && navigate("/auth");
    (authRoutes.includes(pathname) && token) && navigate("/");
    dispatch(setIsloading(false));
    }, [token, pathname]);

  return (
    isLoading
      ? <h1>Loading</h1>
      : (
          <Routes>
            { chatNavigator }
            { authNavigator }
          </Routes>
        )
  );
};