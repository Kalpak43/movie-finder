import "./App.css";
import { Route, Routes } from "react-router";
import Layout from "./Layout";
import Homepage from "./pages/Homepage";
import Moviepage from "./pages/Moviepage";
import Loginpage from "./pages/Loginpage";
import SignupPage from "./pages/SignupPage";
import { useAppDispatch, useAppSelector } from "./app/hook";
import { useEffect } from "react";
import { checkSession } from "./features/auth/authThunk";
import supabase from "./supabase";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { getFavorites, getRecommendations } from "./features/movies/movieThunk";
import Favoritepage from "./pages/Favoritepage";
import Searchpage from "./pages/Searchpage";
import ThemeToggler from "./components/ThemeToggler";
import { Toaster } from "@/components/ui/toaster";
import PageTransition from "./components/PageTransition";
import { useToast } from "./hooks/use-toast";

function App() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // useEffect(() => {}, [dispatch]);

  useEffect(() => {
    // Initialize auth state only once
    const initAuth = async () => {
      await dispatch(checkSession());
    };

    // Set up auth listener for subsequent changes only
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "INITIAL_SESSION") {
        dispatch(checkSession());
      }
    });

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getRecommendations());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      toast({
        title: "Logged in successfully",
        variant: "success",
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) dispatch(getFavorites(user.id));
  }, [user]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <PageTransition>
                <Homepage />
              </PageTransition>
            }
          />
          <Route
            path="/search"
            element={
              <PageTransition>
                <Searchpage />
              </PageTransition>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/favorites"
              element={
                <PageTransition>
                  <Favoritepage />
                </PageTransition>
              }
            />
          </Route>
          <Route
            path="/movie/:movieId"
            element={
              <PageTransition>
                <Moviepage />
              </PageTransition>
            }
          />
        </Route>
        <Route
          path="/login"
          element={
            <PageTransition>
              <Loginpage />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <SignupPage />
            </PageTransition>
          }
        />
      </Routes>
      <ThemeToggler />
      <Toaster />
    </>
  );
}

export default App;
