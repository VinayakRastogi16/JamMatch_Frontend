import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CircleUserIcon } from "lucide-react";
import API from "../services/api";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const Login = ()=> {
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

            <h2 className="text-white text-2xl font-bold">Welcome back</h2>
            <p className="text-xl mb-4 text-zinc-600">
              Sign in to find your next session
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
                <label htmlFor="username" className="text-white">
                Username
              </label>
              <div className="relative">
              <CircleUserIcon className="absolute mt-3 ms-2 text-[#7e8592] z-10"/>
              <Input
                id="username"
                placeholder="Enter your username"
                className="bg-[#29282b] pr-20 text-white focus:outline-[#f68523] border-none pl-10 h-12 placeholder:text-muted-foreground focus-visible:ring mb-5"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              </div>

                <label htmlFor="password" className="text-white">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute mt-3 text-[#7e8592] ms-2"/>
                <Input
                id="password"
                placeholder="••••••••"
                className="bg-[#29282b] text-white pr-20 focus:outline-[#f68523] border-none pl-10 h-12 border-border placeholder:text-muted-foreground focus-visible:ring"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="absolute right-3 top-1/3  text-[#7e8592] hover:text-white" onClick={show}>
                {showPassword ? <EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
              </button>
              </div>
              

              <span className="">
                <Button onClick={handleLogin} className="bg-[#f68523] hover:bg-[rgb(246,133,35)]/75 pr-[18.3vh] pl-[18.3vh] h-12 text-xl font-semibold mt-12" >
                Log In
              </Button>
              </span>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
