import { Navigate } from "react-router-dom";

const Protected = ({ children, isSignedIn }) => {
  if (!isSignedIn) {
    return <Navigate to="/" />;
  }
  return children;
};

export default Protected;
