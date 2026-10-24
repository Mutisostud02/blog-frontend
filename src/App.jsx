import { useState, createContext } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Outlet } from "react-router";

const LogInContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  username: "",
  setUsername: () => {},
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "",
  );

  return (
    <>
      <LogInContext
        value={{ isLoggedIn, setIsLoggedIn, username, setUsername }}
      >
        <Header/>
        <main>
          <Outlet/>
        </main>
        <Footer />
      </LogInContext>
    </>
  );
}

export { LogInContext };
export default App;
