import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, CircleUserRound } from "lucide-react";
import API from '../services/api';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e)=>{
    e.preventDefault();
  }

  const show = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async ()=>{
    try {
      const res = await API.post("/login", {
        username, password
      });

      localStorage.setItem("token", res.data.token);
      navigate("/feed")
    } catch (e) {
      console.log(e);
      alert("Login Failed")
      
    }

  }

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
            <div className="" style={{height:"100vh"}}>
              <div className="flex items-end justify-start h-[100vh] w-full p-4">
              <p>
              <p  className="text-5xl text-white font-bold">Find your</p>
              <p style={{ color: "#f68523" }} className="text-5xl font-bold my-4">
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
          style={{ backgroundColor: "#141213", height:"100vh" }}
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

            <form className="items-center" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-white">Username</label>{" "}
                &nbsp;&nbsp;
                <CircleUserRound className="absolute w-4 h-4 mb-2" />
                <div>
                  <input
                    className="form-control border-color"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ backgroundColor: "#27272b", color: "white" }}
                  />
                </div>
              </div>

              <label className="form-label text-white">Password</label>
                &nbsp;&nbsp;
                <Lock className="absolute w-4 h-4 mb-2" />

              <div className="mb-4 d-flex">
                <input
                  id="password"
                  type = {showPassword ? "text":"password"}
                  value={password}
                  placeholder="••••••••"
                  className="form-control border-color "
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={show} type="button" className="btn">
                  {showPassword ? <EyeOff color="#f68523" className="w-4 h-4" /> : <Eye color="#f68523" className="w-4 h-4" />}
                </button>
              </div>

              <div>
              <button
                onClick={handleLogin}
                className="btn w-100"
                style={{ backgroundColor: "#f68523", color: "white" }}
              >
                Log In
              </button>
              </div>
            </form>

            {/* <div className="relative flex item-center gap-4">
            <div className="flex-1 h-px bg-zinc"></div>
            <p className="text-zinc-600 tracking-wider text-muted-foreground uppercase">Or continue with</p>
            <div className="flex-1 h-px bg-border"></div>
            </div> */}



            <p className="account mt-3">
              Don't have an account? | <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

