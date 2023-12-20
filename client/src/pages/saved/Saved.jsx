import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BASE_URL } from "../../config/config";
import { get } from "../../components/handlers/storage";
import { Alert, Container } from "react-bootstrap";
import Homecard from "../../components/skeleton/homecard";
import SocialCard from "../../components/socialCard.jsx/SocialCard";

const Saved = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/post/bookmarks`, {
        headers: {
          "Content-Type": "application/type",
          Authorization: `Bearer ${get("dsh_token")}`,
        },
      })
      .then((data) => {
        setPosts(data.data.response);
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <h1 className="display-4 fw-bold text-blue my-3">Saved bookmarks</h1>
      {loading ? (
        <div className=" my-5">
          <Homecard count="5" />
        </div>
      ) : (
        posts.map((post) => (
          <div key={post._id}>
            <SocialCard post={post} />
          </div>
        ))
      )}

      {!loading && posts.length === 0 && (
        <Alert variant="primary text-center">
          You don't have any bookmarks yet.
        </Alert>
      )}
    </Container>
  );
};

export default Saved;
