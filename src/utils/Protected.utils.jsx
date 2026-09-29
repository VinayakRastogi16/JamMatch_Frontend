import { Navigate, Outlet } from "react-router-dom";


const Protected = ({children, allowIncomplete = false})=>{
  let user = null;

  try{
    const stored = localStorage.getItem("user");
    user = stored? JSON.parse(stored):null;

  }catch(e){
    localStorage.removeItem("user");
    console.error(e);
    return <Navigate to="/" replace/>;
  }

  if (!user || !user.token) return <Navigate to="/" replace />;
  if (!user.profileCompleted && !allowIncomplete) return <Navigate to="/details" replace />;

  return children;
};

const ProtectedVerification = ()=>{
  let user = null;

  try {
    const stored = localStorage.getItem("user");
    user = stored?JSON.parse(stored):null;
  } catch (e) {
    console.log(e);
    localStorage.removeItem("user");
    return <Navigate to="/" replace/>
  }

  if(!user?.token){
    return <Navigate to="/" replace/>;
  }

  return <Outlet/>
}

export {Protected, ProtectedVerification};