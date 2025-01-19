import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { StoreProvider, useStoreContext } from "./Context";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "./firebase";
import "./App.css";
import HomeView from "./Views/HomeView";
import RegisterView from "./Views/RegisterView";
import LoginView from "./Views/LoginView";
import MoviesView from "./Views/MoviesView";
import DetailView from "./Views/DetailView";
import SettingsView from "./Views/SettingsView";
import CartView from "./Views/CartView";
import ErrorView from "./Views/ErrorView";
import ProtectedRoutes from "./Util/ProtectedRoutes";

function AppContent() {
  const { setCurrentUser, setUserGenreList } = useStoreContext();
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const docRef = doc(firestore, 'users', user.uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const userInfo = docSnapshot.data();
          setUserGenreList(userInfo.genreList);

        } else {
          console.error("Document does not exist");
        }
      } else {
        console.error("No current user");
      }
      setIsUserLoaded(true);
    });

    return () => unsubscribe();
  }, [setCurrentUser, setUserGenreList, navigate]);

  if (!isUserLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/login" element={<LoginView />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/movies" element={<MoviesView />} />
        <Route path="/movies/:movieId" element={<DetailView />} />
      </Route>
      <Route path="*" element={<ErrorView />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;