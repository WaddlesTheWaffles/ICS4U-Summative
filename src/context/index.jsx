import { useState, createContext, useContext } from "react";
import { Map } from 'immutable';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [accountList, setAccountList] = useState([]);
    const [allGenreList, setAllGenreList] = useState(Map());
    const [currentAccount, setCurrentAccount] = useState({})
    const [cart, setCart] = useState(Map());

    return (
        <StoreContext.Provider value={{ accountList, setAccountList, allGenreList, setAllGenreList, currentAccount, setCurrentAccount, cart, setCart }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}