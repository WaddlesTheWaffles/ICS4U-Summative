import { Outlet, Navigate } from "react-router-dom";
import { useStoreContext } from "../Context";

function ProtectedRoutes() {
    const { currentAccount } = useStoreContext();

    return (
        currentAccount.email ? <Outlet /> : <Navigate to="/login" />
    )
}

export default ProtectedRoutes