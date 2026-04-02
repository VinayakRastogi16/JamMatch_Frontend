import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, User } from "lucide-react";
import API from "../services/api";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const show = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/feed");
    } catch (e) {
      console.log(e);
      alert("Login Failed");
    }
  };

  return (
    <>
      <div className="grid grid-cols-2">
        <div
          style={{
            backgroundImage: `
        linear-gradient(
          to right,
          rgba(7, 6, 6, 0.85) 20%,
          rgba(0, 0, 0, 0.32) 50%,
          rgba(0, 0, 0, 0) 100%
        ),
        url('/login-bg.jpg')
      `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <div className="" style={{ height: "100vh" }}>
            <div className="flex items-end justify-start h-[100vh] w-full p-4">
              <p>
                <p className="text-5xl text-white font-bold">Find your</p>
                <p
                  style={{ color: "#f68523" }}
                  className="text-5xl font-bold my-4"
                >
                  perfect jam.
                </p>
                <p className="text-zinc-600">
                  Connect with musicians near you. Match by genre, skill level,
                  and vibe.
                </p>
              </p>
            </div>
          </div>
        </div>
        <></>
        <div
          className="flex justify-center"
          style={{ backgroundColor: "#141213", height: "100vh" }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }} className="m-auto">
            <img
              src="/Jam.png"
              alt=""
              style={{ height: "150px", width: "170px" }}
            />

            <h2 className="text-white fw-bold">Welcome back</h2>
            <p className="text-secondary mb-4">
              Sign in to find your next session
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ?<Eye className="w-4 h-4" />:<EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="button"
                onClick={handleLogin}
                className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--glow-primary)] transition-shadow"
              >
                Login
              </button>
              <p className="account mt-3">
                Don't have an account? | <Link to="/signup">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
