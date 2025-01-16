import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./Context";
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

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;