import { Outlet, Navigate } from "react-router-dom";
import { useStoreContext } from "../Context";
import { getAuth } from 'firebase/auth';
import { auth } from "../firebase";

function ProtectedRoutes() {
    const auth = getAuth();
    const { currentUser, setCurrentUser } = useStoreContext();

    return (
        currentUser ? <Outlet /> : <Navigate to="/login" />
    )
}

export default ProtectedRoutes