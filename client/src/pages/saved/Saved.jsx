import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BASE_URL } from "../../config/config";
import { get } from "../../components/handlers/storage";
import { Alert, Col, Container, Row } from "react-bootstrap";
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
      <Row>
        <Col lg="8" className="m-auto">
          <h1 className="display-4 fw-bold text-light-blue my-3">
            Saved bookmarks [{posts.length || 0}]
          </h1>
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
            <Alert
              variant="none"
              className="text-center border-2 border-primary p-1 text-light-blue p-0"
            >
              You don't have any bookmarks yet.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Saved;
