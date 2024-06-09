import React from "react";
import { Container, Logo, Button, Menu } from "../index";
import { IoMenu } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openMenu } from "../../app/menuSlice";
import { setFocus } from "../../app/searchSlice";

const MobileHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showMenu = useSelector((state) => {
    return state.menu.show;
  });
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleOpenMenu = () => {
    dispatch(openMenu());
    document.querySelector("body").style.overflow = "hidden";
  };

  return (
    <header className="sticky top-0 z-[9999] h-auto w-full bg-white py-5 shadow-md">
      <Container>
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              bgColor="bg-transparent"
              textColor="text-gray-800"
              onClick={handleOpenMenu}
            >
              <span className="sr-only">open menu</span>
              <IoMenu size="1.5rem" />
            </Button>
            <Link to="/">
              <Logo size="extrasmall" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="border-r-2 pr-4"
              bgColor="bg-transparent"
              textColor="text-gray-800"
              onClick={() => {
                dispatch(openMenu());
                dispatch(setFocus());
                document.querySelector("body").style.overflow = "hidden";
              }}
            >
              <IoMdSearch size="1.5rem" />
            </Button>

            <Button
              bgColor="bg-transparent"
              textColor="text-brand-primary"
              className="align-middle"
              title="profile"
              onClick={() => {
                if (user) {
                  navigate(`/users/profile/${user?._id}`);
                } else {
                  navigate("/login");
                }
              }}
            >
              {isLoggedIn ? (
                <div className="h-[1.5rem] w-[1.5rem] overflow-hidden rounded-full">
                  <img
                    className="h-full w-full object-cover object-center"
                    src={user?.avatar.url || "/userDefaultDp.jpg"}
                  />
                </div>
              ) : (
                <FaUserCircle size="1.5rem" />
              )}
            </Button>
          </div>
        </section>
      </Container>
      {showMenu && <Menu />}
    </header>
  );
};

export default MobileHeader;
