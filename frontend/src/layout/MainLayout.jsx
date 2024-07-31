import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Header, Footer } from "../components";
import { Outlet } from "react-router-dom";
import userService from "../services/user.service.js";
import { userLogin, userLogout } from "../app/authSlice.js";
import { setUserDetails } from "../app/userSlice.js";
import { ScrollRestoration } from "react-router-dom";

const MainLayout = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const { data } = await userService.currentUser();
        if (data) {
          dispatch(userLogin(data));
          dispatch(setUserDetails(data));
        } else {
          dispatch(userLogout());
        }
      } catch (error) {
        if (error?.reason === "jwt expired" && error?.statusCode === 401) {
          // Access token has expired. Try with refresh token
          try {
            console.log("access token expired. Trying with refresh token");
            await userService.refreshAccessTokenOfUser();
            const { data } = await userService.currentUser();
            if (data) {
              dispatch(userLogin(data));
              dispatch(setUserDetails(data));
            } else {
              dispatch(userLogout());
            }
          } catch (refreshError) {
            console.log("Failed to refresh access token");
            dispatch(userLogout());
          }
        } else {
          console.log("Failed to get current user", error.reason);
          dispatch(userLogout());
        }
      } finally {
        setLoading(false);
      }
    };
    checkUserAuthentication();
  }, [dispatch]);

  return loading ? (
    <AppLoading />
  ) : (
    <>
      <ScrollRestoration />
      <div className="relative grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

const AppLoading = () => {
  return (
    <div className="min-h-scree flex justify-center">
      <h3 className="mt-10 text-center text-4xl text-gray-500">...Loading</h3>
    </div>
  );
};

export default MainLayout;
