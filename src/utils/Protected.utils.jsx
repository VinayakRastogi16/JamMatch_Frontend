import { Navigate } from "react-router-dom";
import Protected from './Protected.utils';


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
}

  if (!user || !user.token) return <Navigate to="/" replace />;
  if (!user.profileCompleted && !allowIncomplete) return <Navigate to="/details" replace />;

  return children;
};

export default Protected;