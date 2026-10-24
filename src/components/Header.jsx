import { useContext } from "react";
import { LogInContext } from "../App";
import { NavLink, useLocation } from "react-router";

export default function Header() {
  const bcg = {
    backgroundColor: "oklch(44.6% 0.043 257.281)",
    width: "100dvw",
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
  };

  const { isLoggedIn, username, setIsLoggedIn, setUsername } = useContext(LogInContext);

  const location = useLocation();

  function handleLogOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setIsLoggedIn(false);
    setUsername("");
    console.log("Log out successful");
  }
console.log("Header rendered:", { isLoggedIn, username });
  return (
    <header style={bcg}>
      <h2 style={{ color: "white" }}>Blog App</h2>
      <p style={{ padding: "3px" }}>
        {isLoggedIn ? (
          <button className="bg-blue-400 hover:text-blue-900 active:underline p-1 text-[0.8rem] text-white rounded-[3px]" type="button" onClick={handleLogOut}>
            Log-Out
          </button>
        ) : (
          <NavLink
            to={location.pathname === "/sign-in" ? "/posts" : "/sign-in"}
            className="bg-blue-400 hover:text-blue-900 active:underline p-1 px-2 text-[0.8rem] text-white rounded-[3px]"
          >
            {location.pathname === "/sign-in" ? "Home" : "Sign-in"}
          </NavLink>
        )}
      </p>
    </header>
  );
}
