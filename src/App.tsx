import "./App.css";
import { Route, Routes } from "react-router";
import Layout from "./Layout";
import Homepage from "./pages/Homepage";
import Moviepage from "./pages/Moviepage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="/movie/:movieId" element={<Moviepage />} />
      </Route>
    </Routes>
  );
}

export default App;
