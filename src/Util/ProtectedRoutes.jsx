import { Outlet, Navigate } from "react-router-dom";
import { useStoreContext } from "../Context";

function ProtectedRoutes() {
    const { currentUser } = useStoreContext();

    return (
        currentUser.email ? <Outlet /> : <Navigate to="/login" />
    )
}

export default ProtectedRoutes