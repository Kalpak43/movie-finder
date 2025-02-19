import "./App.css";
import Header from "./components/Header";
import Searchbar from "./components/Searchbar";

function App() {
  return (
    <>
      <Header />
      <main className="px-8 md:px-20 py-10">
        <Searchbar />
      </main>
    </>
  );
}

export default App;
