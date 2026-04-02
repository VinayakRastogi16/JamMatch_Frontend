import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import TinderCard from "react-tinder-card";

function Feed() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await API.get("/feed");
      setUser(res.data.user);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchUser();
  }, []);

  const handleLike = async () => {
    await API.post(`/like/${user.id}`);
    await fetchUser();
  };

  const swipe = (dir) => {
          if (dir === "right") handleLike();
          if (dir === "left") handleSkip();
        }

  const handleSkip = async () => {
    await API.post(`/skip/${user.id}`);
    console.log(user);
    await fetchUser();
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) return <h2>No more users</h2>;

  return (
    <div className="pt-5 bg-zinc-600" style={{ height:"100vh"}}>
    <div className="" style={{}}>
      <div className="flex justify-center">
      <TinderCard
        onSwipe={swipe}
        preventSwipe={["up", "down"]}
      >
        <div className="flex justify-center" style={{ width: "300px", height:"60vh", backgroundColor:"#1d1d20", color:"white" }}>
          
          <div className="badge-pill" style={{}}>
              <p>Midnight Serenade</p>
              <p>{user.username}</p>
              <p>{user.instrument}</p>
              <p>{user.skillLevel}</p>
          </div>

        </div>

        
      </TinderCard>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <button onClick={()=>swipe("left")}  className="btn btn-danger me-4">
          Skip
        </button>
        <button onClick={()=>swipe("right")} className="btn btn-success">
          Like
        </button>
        
      </div>
      
    </div>
    </div>
  );
}

export default Feed;
