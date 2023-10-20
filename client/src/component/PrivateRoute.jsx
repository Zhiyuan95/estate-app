import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  //<Outlet /> is a special component used to render the content of subroutes in nested routes
  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
}
