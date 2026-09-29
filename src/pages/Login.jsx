import { useState } from "react";

import {
  Lock,
  Eye,
  EyeOff,
  CircleUserIcon,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import API from "../services/api";

import bgImage from "../assets/login-bg.jpg";
import logo from "../assets/image.svg";

import { Link, useNavigate } from "react-router-dom";

const Login = ({ setIsSignedIn }) => {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", {
        username,
        password,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          token: res.data.token,
          profileCompleted: res.data.user.profileCompleted,
          email: res.data.user.email,
          id: res.data.user.id,
        })
      );

      setIsSignedIn(true);

      // First check profile completion
      if (!res.data.user.profileCompleted) {
        navigate("/details");
        return;
      }

      // Then check email verification
      const verificationRes = await API.get("/email-verification-status");

      if (!verificationRes.data.emailVerified) {
        navigate("/verify-email/pending");
        return;
      }

      // Everything is complete
      navigate("/feed");

    } catch (e) {
      console.log(e);

      if (
        e.response?.status === 403 &&
        e.response?.data?.code === "EMAIL_NOT_VERIFIED"
      ) {
        navigate("/verify-email/pending");
        return;
      }

      alert(e.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#111113] lg:grid lg:grid-cols-2">

      {/* LEFT IMAGE SECTION */}
      <div
        className="relative hidden lg:flex min-h-screen items-end"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(7, 6, 6, 0.85) 20%,
              rgba(0, 0, 0, 0.32) 50%,
              rgba(0, 0, 0, 0) 100%
            ),
            url(${bgImage})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full p-8 xl:p-12">
          <h1 className="text-4xl xl:text-5xl text-white font-bold">
            Find your
          </h1>

          <h1 className="text-4xl xl:text-5xl font-bold my-3 text-[#f68523]">
            perfect jam.
          </h1>

          <p className="max-w-md text-zinc-400 text-base xl:text-lg">
            Connect with musicians near you. Match by genre, skill level,
            and vibe.
          </p>
        </div>
      </div>

      {/* RIGHT LOGIN SECTION */}
      <div className="relative min-h-screen flex items-center justify-center px-5 py-10 sm:px-8">

        {/* Background Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(
                hsl(var(--primary)) 1px,
                transparent 4px
              ),
              linear-gradient(
                90deg,
                hsl(var(--primary)) 1px,
                transparent 4px
              )
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* FORM CONTAINER */}
        <div className="relative z-10 w-full max-w-[400px]">

          {/* LOGO */}
          <div className="flex justify-center lg:justify-start">
            <img
              src={logo}
              className="h-28 w-28 sm:h-32 sm:w-32 object-contain"
              alt="JamMatch Logo"
            />
          </div>

          {/* HEADING */}
          <h2 className="text-white text-2xl sm:text-3xl font-bold">
            Welcome back
          </h2>

          <p className="text-base sm:text-xl mb-6 text-zinc-600">
            Login to vibe with your people
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* USERNAME */}
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-white"
              >
                Username
              </label>

              <div className="relative">
                <CircleUserIcon
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-[#7e8592]
                    z-10
                    h-5
                    w-5
                  "
                />

                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="
                    bg-[#29282b]
                    text-white
                    border-none
                    pl-10
                    h-12
                    placeholder:text-muted-foreground
                    focus-visible:ring-1
                    focus-visible:ring-[#f68523]
                  "
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-white"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-[#7e8592]
                    h-5
                    w-5
                  "
                />

                <Input
                  id="password"
                  placeholder="••••••••"
                  className="
                    bg-[#29282b]
                    text-white
                    border-none
                    pl-10
                    pr-12
                    h-12
                    placeholder:text-muted-foreground
                    focus-visible:ring-1
                    focus-visible:ring-[#f68523]
                  "
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#7e8592]
                    hover:text-white
                  "
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <Button
              type="submit"
              className="
                w-full
                h-12
                mt-8
                bg-[#f68523]
                hover:bg-[#f68523]/75
                text-lg
                font-semibold
              "
            >
              Log In
            </Button>

            {/* SIGNUP LINK */}
            <div className="flex justify-center text-sm text-zinc-400">
              <p>
                Don't have an account?{" "}
                <span className="mx-1">|</span>{" "}
                <Link
                  to="/signup"
                  className="text-white hover:text-[#f68523] transition-colors"
                >
                  Sign <span className="text-[#f68532]">Up</span>
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;