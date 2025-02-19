import "./App.css";
import { Button } from "./components/ui/button";
import { useTheme } from "./contexts/ThemeProvider";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="">
      Hello
      <Button onClick={toggleTheme}>Toggle</Button>
    </div>
  );
}

export default App;
