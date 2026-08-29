import { useEffect, useState } from "react";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  async function getPosts() {
    try {
      const response = await fetch("http://localhost:3000/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();

      setPosts(result);
    } catch (err) {
      console.error("Server error", err);
    }
  }

  useEffect(() => {
    getPosts()
  }, [])

  const postStyle = {
    background : "oklch(92.9% 0.013 255.508)",
    opacity: 0.9,
    width: "50dvw",
    listStyleType: "none",
    margin: "2px",
    padding: "0.5rem"
  }

  const padding = {
    paddingBottom: "0.5rem"
  }

  return (
    <>
    <h2></h2>
    <ul>
      {posts.length > 0 ? posts.map(post => 
      <div style={postStyle}>
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </li>
        <button style={padding}>show more</button>
        <hr/>
      </div>
      )
      :
      <p>No blogs found</p>    
    }
    </ul>
    </>
  );
}
