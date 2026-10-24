import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import Posts, { Post } from "./components/Posts.jsx";
import Form from "./components/Form.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/posts" replace />,
      },
      {
        path: "posts",
        element: <Posts />,
        children: [
          {
            path: ":id",
            element: <Post />,
          },
        ],
      },
      {
        path: "sign-in",
        element: <Form />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
