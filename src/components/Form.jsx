import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { LogInContext } from "../App";

export default function Form() {
  const { setIsLoggedIn, setUsername } = useContext(LogInContext);
  const [signInForm, setSignInForm] = useState(false);

    const navigate = useNavigate();

  async function handleSignIn(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log(result.msg);
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("username", data.username);

      setIsLoggedIn(true);
      setUsername(data.username);
      navigate("/posts");

      console.log("Log-in Successful");
    } catch (err) {
      console.error("Server Error", err);
    }
  }

  function handleSwitchForm() {
    setSignInForm((prev) => !prev);
  }

  async function handleSignUp(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log(result.msg);
        return;
      }

      handleSwitchForm();

      console.log("Signup Successful");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      className="bg-white rounded-2xl font-semibold p-4 m-2 max-w-[280px]"
    >
      {signInForm ? (
        <FormDetails
          onSwitch={handleSwitchForm}
          onSubmit={handleSignUp}
          submitText={"Sign-Up"}
          switchText={"Sign-In"}
          switchMessage={"Already have an account? "}
          isSignUp={true}
        />
      ) : (
        <FormDetails
          onSwitch={handleSwitchForm}
          onSubmit={handleSignIn}
          submitText={"Sign-In"}
          switchText={"Sign-Up"}
          switchMessage={"Don't have an account?"}
          isSignUp={false}
        />
      )}
    </div>
  );
}

function FormDetails({
  onSwitch,
  onSubmit,
  submitText,
  switchText,
  switchMessage,
  isSignUp,
}) {

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" className="border-b-black border-1 rounded p-0.5" required/>
        {isSignUp && (
          <>
            <label htmlFor="email">email </label>
            <input type="email" name="email" id="email" className="border-b-black border-1 rounded p-0.5" required />
          </>
        )}
        <label htmlFor="password">Password </label>
        <input type="password" name="password" id="password" className="border-b-black border-1 rounded p-0.5" required />
        <button type="submit" className="hover:text-blue-900 rounded-[5px] p-1 text-amber-50 text-[0.8rem] bg-blue-400 active:underline">
          {submitText}
        </button>
      </form>
      <br/>
      <p>
        {switchMessage}{" "}
        <button className="bg-blue-400 hover:text-blue-900 active:underline p-1 text-[0.8rem] text-white rounded-[3px]" type="button" onClick={onSwitch}>
          {switchText}
        </button>
      </p>
    </>
  );
}
