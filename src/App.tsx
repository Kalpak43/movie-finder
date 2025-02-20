import "./App.css";
import { Route, Routes } from "react-router";
import Layout from "./Layout";
import Homepage from "./pages/Homepage";
import Moviepage from "./pages/Moviepage";
import Loginpage from "./pages/Loginpage";
import SignupPage from "./pages/SignupPage";
import { useAppDispatch } from "./app/hook";
import { useEffect } from "react";
import { checkSession } from "./features/auth/authThunk";
import supabase from "./supabase";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check initial session
    dispatch(checkSession());

    // Set up auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      dispatch(checkSession());
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route path="/movie/:movieId" element={<Moviepage />} />
      </Route>
      <Route path="/login" element={<Loginpage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App;
