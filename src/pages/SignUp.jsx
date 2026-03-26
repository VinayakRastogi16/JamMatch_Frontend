import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, CircleUserRound, FolderPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function SignUp() {

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = (e)=>{
    e.preventDefault();
  }

  const show = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async ()=>{
    try{
      await API.post("/register", {
        email,
        username,
        name,
        password
      });

      alert("Signup successful");
      navigate("/");

    }catch(e){
      console.error(e);
      alert("Signup failed")
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6 p-0">
          <div
            className="d-flex flex-column justify-content-end p-5"
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
            <div>
              <h1 className="text-white fw-bold">Find your</h1>
              <h1 style={{ color: "#f68523" }} className="fw-bold">
                perfect jam.
              </h1>
              <p className="text-secondary">
                Connect with musicians near you. Match by genre, skill level,
                and vibe.
              </p>
            </div>
          </div>
        </div>
        <div
          className="col-6 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "#141213" }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <img
              src="/Jam.png"
              alt=""
              style={{ height: "150px", width: "170px" }}
            />

            <h2 className="text-white fw-bold">Welcome</h2>
            <p className="text-secondary mb-4">
              Ready to Jam!
            </p>

            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
              <div className="mb-3">
                <label className="form-label text-white">Email</label> &nbsp;&nbsp;
                <Mail  className="absolute w-4 h-4 mb-2" />
                <div>
                  
                  <input
                    className="form-control border-color"
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    style={{ backgroundColor: "#27272b", color: "white" }}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-white">Name</label> &nbsp;&nbsp;
                <FolderPen  className="absolute w-4 h-4 mb-2" />
                <div>
                  
                  <input
                    className="form-control border-color"
                    placeholder="Enter your name"
                    type="text"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    style={{ backgroundColor: "#27272b", color: "white" }}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-white">Username</label> &nbsp;&nbsp;
                <CircleUserRound  className="absolute w-4 h-4 mb-2" />
                <div>
                  
                  <input
                    className="form-control border-color"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    style={{ backgroundColor: "#27272b", color: "white" }}
                    required
                  />
                </div>
              </div>

              <label className="form-label text-white">Password</label>&nbsp;&nbsp;
                <Lock className="absolute w-4 h-4 mb-2" />

              <div className="mb-4 d-flex">
                
                  
                  <input
                    id="password"
                    type={showPassword?"text":"password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="form-control border-color"
                    required
                  />
                  <button type="button" onClick={show} className="btn">
                    {showPassword ? <EyeOff color="#f68523" className="w-4 h-4" /> : <Eye color="#f68523" className="w-4 h-4" />}
                  </button>
              </div>

              <button
                className="btn w-100"
                onClick={handleSignUp}
                style={{ backgroundColor: "#f68523", color: "white" }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
