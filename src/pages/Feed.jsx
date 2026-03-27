/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Feed() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await API.get("/feed");
      setUser(res.data.user);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchUser();
  });

  const handleLike = async () => {
    await API.post(`/like/${user.id}`);
    fetchUser();
  };

  const handleSkip = async () => {
    await API.post(`/skip/${user.id}`);
    console.log(user);
    fetchUser();
  };

  if (!user) return <h2>No more users</h2>;

  return (
      <div className="card mb-3 mx-5 mt-5">
        <div className="card-body place-items-center">
          <h5 className="card-title fw-bold">{user.name}</h5>
          <h5 className="card-title fw-bold">{user.username}</h5>
          <ul className="card-text">
            <li><b>Instrument:</b> {user.instrument}</li>
            <li><b>Genre:</b> {user.genre}</li>
            <li><b>Skill:</b> {user.skillLevel}</li>
          </ul>
          <div style={{ marginTop: "20px" }}>
        <button onClick={handleLike} className="btn btn-success me-3">
          Like
        </button>
        <button onClick={handleSkip} className="btn btn-danger">
          Skip
        </button>
        </div>
      </div>
      </div>
  );
}

export default Feed;