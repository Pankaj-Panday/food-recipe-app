import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Logo, Searchbar, Button, Navbar } from "../index";
import userService from "../../services/user.service.js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { setAuthLoading, userLogout } from "../../app/authSlice.js";
import { useDispatch, useSelector } from "react-redux";

const DesktopHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.loading);

  return (
    <header className="sticky top-0 z-[9999] h-auto w-full bg-white pb-2 pt-5 shadow-md">
      <Container>
        <section className="flex items-center justify-between gap-14">
          <Link to="/">
            <Logo />
          </Link>
          <Searchbar />

          {isLoggedIn ? (
            <div className="flex gap-2">
              <Button
                bgColor="bg-transparent"
                textColor="text-brand-primary"
                className="align-middle disabled:opacity-50"
                title="profile"
                disabled={authLoading}
                onClick={() => {
                  navigate(`/users/profile/${user._id}`);
                }}
              >
                <div className="h-8 w-8 overflow-hidden rounded-full">
                  <img
                    className="h-full w-full object-cover object-center"
                    src={user?.avatar.url || "/userDefaultDp.jpg"}
                  />
                </div>
              </Button>
              <Button
                className="ease w-28 min-w-20 border-2 border-brand-primary px-3 py-2 text-sm font-medium capitalize transition-all duration-100 hover:bg-brand-primary hover:text-white disabled:opacity-50"
                bgColor="bg-transparent"
                textColor="text-brand-primary"
                disabled={authLoading}
                onClick={() => {
                  navigate("/add-recipe");
                }}
              >
                Add recipe
              </Button>
              <Button
                className="ease flex w-28 min-w-20 items-center justify-center border-2 border-transparent px-3 py-2 text-sm font-medium capitalize transition-all duration-100 hover:bg-brand-primary hover:text-white disabled:opacity-50"
                bgColor="bg-brand-primary-light"
                textColor="text-brand-primary"
                disabled={authLoading}
                onClick={async () => {
                  dispatch(setAuthLoading(true));
                  try {
                    await userService.logoutUser();
                    // If logout is successful, clear Redux state
                    dispatch(userLogout());
                  } catch (error) {
                    console.error("Problem logging out user", error.reason);
                    // Even if there's an error, ensure the user is logged out on the frontend
                    dispatch(userLogout());
                  } finally {
                    dispatch(setAuthLoading(false));
                  }
                }}
              >
                {authLoading ? (
                  <AiOutlineLoading3Quarters className="animate-spin align-middle text-sm" />
                ) : (
                  <span>Logout</span>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                className="ease w-24 min-w-20 border-2 border-brand-primary px-3 py-2 text-sm font-medium capitalize transition-all duration-100 hover:bg-brand-primary hover:text-white"
                bgColor="bg-transparent"
                textColor="text-brand-primary"
                onClick={() => navigate("/signup")}
              >
                Signup
              </Button>
              <Button
                className="ease w-24 min-w-20 border-2 border-transparent px-3 py-2 text-sm font-medium capitalize transition-all duration-100 hover:bg-brand-primary hover:text-white"
                bgColor="bg-brand-primary-light"
                textColor="text-brand-primary"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          )}
        </section>
        <section>
          <Navbar />
        </section>
      </Container>
    </header>
  );
};

export default DesktopHeader;
