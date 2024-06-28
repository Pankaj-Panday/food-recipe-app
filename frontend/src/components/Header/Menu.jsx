import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Button, Logo, Navbar, Searchbar } from "../index.js";
import { useDispatch, useSelector } from "react-redux";
import { closeMenu } from "../../app/menuSlice.js";
import { useNavigate } from "react-router-dom";
import userService from "../../services/user.service.js";
import { setAuthLoading, userLogout } from "../../app/authSlice.js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { removeFocus, setFocus } from "../../app/searchSlice.js";

const Menu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const authLoading = useSelector((state) => state.auth.loading);
  const menuOpen = useSelector((state) => state.menu.show);

  useEffect(() => {
    return () => {
      if (!menuOpen) dispatch(removeFocus());
    };
  }, [dispatch, removeFocus, menuOpen]);

  const handleCloseMenu = () => {
    dispatch(closeMenu());
    document.querySelector("body").style.overflow = "unset";
  };

  return (
    <article className="fixed inset-0 min-h-screen bg-white">
      <Button
        bgColor="bg-transparent"
        textColor="text-gray-800"
        onClick={handleCloseMenu}
        className="absolute right-4 top-4"
      >
        <span className="sr-only">close menu</span>
        <IoMdClose size="1.5rem" />
      </Button>
      <section className="px-4">
        <Logo size="small" className="my-4" />
        <div className="mt-10">
          <Searchbar label="Search" />
        </div>
        <Navbar />
        {isLoggedIn ? (
          <div className="mt-5 flex flex-col gap-2">
            <Button
              className="h-10 w-full py-2 text-sm font-semibold uppercase"
              bgColor="bg-brand-primary-light"
              textColor="text-brand-primary"
              onClick={() => {
                navigate("/add-recipe");
                handleCloseMenu();
              }}
            >
              Add recipe
            </Button>
            <Button
              className="flex h-10 w-full items-center justify-center py-2 text-sm font-semibold uppercase disabled:opacity-50"
              disabled={authLoading}
              onClick={() => {
                dispatch(setAuthLoading(true));
                userService.logoutUser().then(() => {
                  dispatch(setAuthLoading(false));
                  dispatch(userLogout());
                  handleCloseMenu();
                });
              }}
            >
              {authLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin align-middle text-sm" />
              ) : (
                <span>Log out</span>
              )}
            </Button>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-2">
            <Button
              className="w-full px-3 py-2 text-sm font-semibold uppercase"
              bgColor="bg-brand-primary-light"
              textColor="text-brand-primary"
              onClick={() => {
                navigate("/signup");
                dispatch(closeMenu());
              }}
            >
              Sign up
            </Button>
            <Button
              className="w-full px-3 py-2 text-sm font-semibold uppercase"
              onClick={() => {
                navigate("/login");
                dispatch(closeMenu());
              }}
            >
              Log In
            </Button>
          </div>
        )}
      </section>
    </article>
  );
};

export default Menu;
