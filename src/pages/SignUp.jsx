import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, CircleUserIcon, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/login-bg.jpg";
import logo from "../assets/image.svg";
import { Link } from "react-router-dom";

const Signup = ({ setIsSignedIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSignup();
  };

  const show = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async () => {
    try {
      const res = await API.post("/register", {
        email,
        name,
        username,
        password,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          token: res.data.token,
          id: res.data.user.id,
          username: res.data.user.username,
          email: res.data.user.email,
          profileCompleted: res.data.user.profileCompleted,
        }),
      );
      setIsSignedIn(true);
      navigate("/details");
    } catch (e) {
      console.log(e);
      alert("Login Failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#111113] lg:grid lg:grid-cols-2">
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
          <p className="max-w-md text-zinc-600 text-base x;:text-lg">
            Connect with musicians near you. Match by genre, skill level, and
            vibe.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="relative min-h-screen flex items-center justify-center px-5 py-10 sm:px-8">
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

        {/* form container */}
        <div className="relative z-10 w-full max-w-[400px]">
          {/* logo */}
          <div className="flex justify-center lg:justify-start">
            <img
              src={logo}
              className="h-28 w-28 sm:h-32 sm:w-32 object-contain"
              alt="JamMatch Logo"
            />
          </div>

          {/* heading */}
          <h2 className="text-white text-2xl sm:text-3xl font-bold">Welcome</h2>
          <p className="text-base sm:text-xl mb-6 text-zinc-600">
            Sign Up to vibe with your people
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* email */}

            <div>
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute mt-3 ms-2 text-[#7e8592] z-10" />
                <Input
                  id="email"
                  placeholder="you@example.com"
                  className="bg-[#29282b] pr-20 text-white focus:outline-[#f68523] border-none pl-10 h-12 placeholder:text-muted-foreground focus-visible:ring mb-5"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="text-white">
                Name
              </label>
              <div className="relative">
                <User className="absolute mt-3 ms-2 text-[#7e8592] z-10" />
                <Input
                  id="name"
                  placeholder="Enter your name"
                  className="bg-[#29282b] pr-20 text-white focus:outline-[#f68523] border-none pl-10 h-12 placeholder:text-muted-foreground focus-visible:ring mb-5"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Username */}

            <div>
              <label htmlFor="username" className="text-white">
                Username
              </label>
              <div className="relative">
                <CircleUserIcon className="absolute mt-3 ms-2 text-[#7e8592] z-10" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="bg-[#29282b] pr-20 text-white focus:outline-[#f68523] border-none pl-10 h-12 placeholder:text-muted-foreground focus-visible:ring mb-5"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label htmlFor="password" className="text-white">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute mt-3 text-[#7e8592] ms-2" />
                <Input
                  id="password"
                  placeholder="••••••••"
                  className="bg-[#29282b] text-white pr-20 focus:outline-[#f68523] border-none pl-10 h-12 placeholder:text-muted-foreground focus-visible:ring"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2  text-[#7e8592] hover:text-white"
                  onClick={show}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="bg-[#f68523] hover:bg-[rgb(246,133,35)]/75 pr-[18.3vh] pl-[18.3vh] h-12 text-xl font-semibold mt-12"
            >
              Sign Up
            </Button>

            <div className="flex justify-center text-sm text-zinc-400">
              <p>
                Already have an account?
                <span className="mx-1">|</span>
                <Link
                  to="/"
                  className="text-white hover:text-[#f68523] transition-colors tect-extrabold"
                >
                  Log <span className="text-[#f68523]">In</span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
