import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { auth } from "../firebase";
import { Map } from 'immutable';
import { use } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const navigate = useNavigate();
    const [accountList, setAccountList] = useState([]); //remove later
    const [userGenreList, setUserGenreList] = useState([]);
    const [currentUser, setCurrentUser] = useState({})
    const [cart, setCart] = useState(Map());
    const [previousPurchaseHistory, setPreviousPurchaseHistory] = useState(Map());

    return (
        <StoreContext.Provider value={{ accountList, setAccountList, userGenreList, setUserGenreList, currentUser, setCurrentUser, cart, setCart, previousPurchaseHistory, setPreviousPurchaseHistory }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}