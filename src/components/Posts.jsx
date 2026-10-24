import { useEffect, useState, useContext } from "react";
import { LogInContext } from "../App";
import { NavLink, Outlet, useParams } from "react-router";

export default function Posts() {
  const { isLoggedIn, username } =
    useContext(LogInContext);

  const [posts, setPosts] = useState([]);

  async function getPosts() {
    try {
      const response = await fetch("http://localhost:3000/posts", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.log(result.msg);
        return false;
      }

      setPosts(result);
    } catch (err) {
      console.error("Server error", err);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      {isLoggedIn && (
        <h6 className="bg-sky-400 text-xs">Logged in as {username}</h6>
      )}
      <h4 className="font-bold">Latest blog posts</h4>
      <div className="flex flex-col md:flex-row gap-10">
        <ul className="w-full md:w-1/5">
          {posts.length > 0 ? (
            posts.map((post) => (
              <li
                key={post.id}
                className="ml-4  bg-gray-200 opacity-90 w-2xs p-2 hover:bg-blue-200 hover:font-bold"
              >
                <NavLink to={`/posts/${post.id}`}>
                  <h3>{post.title}</h3>
                </NavLink>
              </li>
            ))
          ) : (
            <p>No blogs found</p>
          )}
          <hr />
        </ul>
        <Outlet />
      </div>
    </>
  );
}

export function Post() {
  const { id } = useParams();

  const { isLoggedIn, setUsername, setIsLoggedIn } = useContext(LogInContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function getPost() {
      try {
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
          method: "GET",
        });

        const result = await response.json();

        if (!response.ok) {
          console.log(result.msg);
          return;
        }

        setPost(result);
      } catch (err) {
        console.error("Server error", err);
      }
    }

    getPost();
  }, [id]);

  useEffect(() => {
    async function getComments() {
      if (!isLoggedIn) {
        setComments([]);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("User must be logged in!");
          return;
        }
        const response = await fetch(
          `http://localhost:3000/posts/${id}/comments`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("username");

          setIsLoggedIn(false);
          setUsername("");
          setComments([]);

          return;
        }

        if (!response.ok) {
          console.log(result.msg);
          return;
        }

        setComments(result.comments);
      } catch (err) {
        console.error("Server error", err);
      }
    }

    getComments();
  }, [id, isLoggedIn]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full md:w-4/5 min-w-0 rounded-2xl text-black bg-blue-200 p-4">
      <h3>{post.title}</h3>
      <hr />
      {post.image_url && (
        <img
          className="p-4"
          src={post.image_url}
          width={400}
          alt={post.title}
        />
      )}
      <p
        style={{
          fontFamily: "jost",
          margin: "0.4rem 0",
        }}
        className="font-[Jost] my-[0.4rem]"
      >
        {post.content}
      </p>
      {isLoggedIn ? (
        <>
          <hr />
          <h5 className="m-4 text-violet-700">Comments</h5>

          <ul className="list-disc pl-6 space-y-2 flex flex-col gap-2">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))
            ) : (
              <p className="italic">No comments on this post</p>
            )}
          </ul>

          <CommentForm
            onCommentAdded={(newComment) =>
              setComments((prev) => [...prev, newComment])
            }
          />
        </>
      ) : (
        <p>
          <NavLink  className="my-8 text-pink-600 hover:text-amber-50 text-amber-300"
           to="/sign-in">Sign in</NavLink> to send and view comments.
        </p>
      )}
    </div>
  );
}

function Comment({ comment }) {
  const timeAgo = useTimeAgo(comment.created_at);

  const { username } = useContext(LogInContext);

  return (
    <li className="p-4 bg-white rounded-2xl font-semibold">
      <p className="font-[Jost] my-[0.4rem] text-blue-950">{comment.content}</p>
      <div className="flex justify-between mt-2">
        <p className="italic text-gray-600 text-[0.7rem] pt-2">
          {username == comment.author.username
            ? "You"
            : comment.author.username}
        </p>
        <span className="text-[0.8rem] text-amber-950">{timeAgo}</span>
      </div>
    </li>
  );
}
function CommentForm({ onCommentAdded }) {
  const { id } = useParams();

  const { setIsLoggedIn, setUsername } = useContext(LogInContext);

  async function handleSendComment(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      content: formData.get("comment"),
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("User must be logged in");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/posts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        setIsLoggedIn(false);
        setUsername("");

        return;
      }

      if (!response.ok) {
        console.log(result.msg);
        return;
      }

      onCommentAdded(result);

      e.target.reset();

      console.log("Comment added successfully");
    } catch (err) {
      console.error("Server error!", err);
    }
  }

  return (
    <form className="m-0 p-6 rounded-2xl" onSubmit={handleSendComment}>
      <textarea
        className="rounded-2xl p-4 bg-white caret-black text-black caret-black outline-none focus:ring-1 focus:ring-blue-500"
        name="comment"
        rows={5}
        cols={50}
        required
      ></textarea>
      <br />
      <button
        className="m-[0.4rem] bg-gray-200 p-2 rounded-2xl active:underline hover:bg-amber-100"
        type="submit"
      >
        Comment
      </button>
    </form>
  );
}

function useTimeAgo(date) {
  const calculateTimeAgo = () => {
    const seconds = Math.max(
      0,
      Math.floor((Date.now() - new Date(date).getTime()) / 1000),
    );

    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo`;

    const years = Math.floor(days / 365);
    return `${years}y`;
  };

  const [timeAgo, setTimeAgo] = useState(calculateTimeAgo);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  return timeAgo;
}
