import React, { useState, useEffect, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { Input, Button } from "./index.js";
import foodImg from "../assets/imgs/loginForm.jpg";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import userService from "../services/user.service.js";
import { userLogin } from "../app/authSlice.js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdContentCopy } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

const LoginForm = () => {
  useEffect(() => {
    function handleOutsideClick(event) {
      if (event.target === overlay && event.target !== formContainer) {
        navigate(-1);
      }
    }

    const overlay = document.getElementById("overlay");
    const formContainer = document.getElementById("formContainer");
    overlay.addEventListener("click", handleOutsideClick);

    return () => {
      overlay.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const {
    register,
    formState: { errors: frontendError, isSubmitting },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [backendError, setBackendError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function onLogin(formData) {
    try {
      const { email, password } = formData;
      const { data } = await userService.loginUser({ email, password });
      if (data.user) {
        dispatch(userLogin(data.user));
        navigate("/");
      }
    } catch (error) {
      setBackendError(error.reason);
    }
  }

  const error = frontendError.email || frontendError.password || backendError;

  return (
    <>
      <div id="overlay" className="overlay">
        <div
          id="formContainer"
          className="sign-log-container my-10 md:mt-0 md:h-[480px]"
        >
          <div className="h-[240px] overflow-hidden rounded-t-xl md:h-full md:flex-1 md:rounded-bl-xl md:rounded-tr-none">
            <img
              className="h-full w-full object-cover"
              src={foodImg}
              alt="food image"
            />
          </div>
          <div className="mx-3 mb-4 md:mb-0 md:flex-1 md:self-center">
            <h2 className="mb-3 text-2xl font-medium">Log In</h2>
            <p className="text-gray-600">
              Log in to save and review your favorite recipes.
            </p>
            {error && (
              <small className="my-2 block rounded-lg bg-red-200 py-1.5 text-center text-red-700">
                {frontendError.email?.message ||
                  frontendError.password?.message ||
                  backendError}
              </small>
            )}
            <DemoUserCredentials />
            <form
              className="mt-2 flex flex-col gap-3"
              onSubmit={handleSubmit(onLogin)}
              noValidate
            >
              <Input
                label="Email"
                type="email"
                required
                placeholder="Your email"
                className="rounded-lg py-2 disabled:opacity-40"
                disabled={isSubmitting}
                autoComplete="off"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                    message: "Invalid email format",
                  },
                })}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Your password"
                className="rounded-lg py-2 disabled:opacity-40"
                autoComplete="off"
                required
                disabled={isSubmitting}
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <Button
                type="submit"
                className="mx-auto mt-3 flex h-10 w-4/5 items-center justify-center rounded-full py-2 capitalize disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <AiOutlineLoading3Quarters className="animate-spin align-middle text-sm" />
                ) : (
                  <span>Log in</span>
                )}
              </Button>
              <p className="my-2 text-center text-sm text-gray-600">
                Don't have an account ?{" "}
                <Link to="/signup" className="text-brand-primary">
                  Signup
                </Link>
              </p>
            </form>
          </div>
          <button
            className="absolute right-2 top-2 grid h-7 w-7 place-content-center rounded-full bg-white text-xl text-black"
            onClick={() => navigate(-1)}
          >
            <FaXmark size="0.9rem" />
          </button>
        </div>
      </div>
    </>
  );
};

const DemoUserCredentials = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [textCopied, setTextCopied] = useState({
    email: false,
    password: false,
  });

  const handleCopy = (copiedItem) => {
    let value;
    if (copiedItem === "email") {
      value = emailRef.current.textContent;
      setTextCopied({ email: true, password: false });
    } else if (copiedItem === "password") {
      value = passwordRef.current.textContent;
      setTextCopied({ email: false, password: true });
    }
    setTimeout(() => {
      setTextCopied({ email: false, password: false });
    }, 1000);
    window.navigator.clipboard.writeText(value);
  };

  return (
    <article className="mt-2 rounded bg-gray-100 p-2 text-xs">
      <section className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <p>
            <span className="font-semibold">Demo email: </span>
            <span ref={emailRef} className="italic text-brand-primary">
              ankitgupta@example.com
            </span>
          </p>
          {!textCopied.email && (
            <button title="copy" onClick={() => handleCopy("email")}>
              <MdContentCopy />
            </button>
          )}
          {textCopied.email && (
            <IoCheckmarkDoneSharp className="text-green-600" />
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p>
            <span className="font-semibold">Demo password: </span>
            <span ref={passwordRef} className="italic text-brand-primary">
              12345678
            </span>
          </p>
          {!textCopied.password && (
            <button title="copy" onClick={() => handleCopy("password")}>
              <MdContentCopy />
            </button>
          )}
          {textCopied.password && (
            <IoCheckmarkDoneSharp className="text-green-600" />
          )}
        </div>
      </section>
    </article>
  );
};

export default LoginForm;
