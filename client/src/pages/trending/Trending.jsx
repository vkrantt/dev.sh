import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { BASE_URL } from "../../config/config";
import SocialCard from "../../components/socialCard.jsx/SocialCard";
import { get } from "../../components/handlers/storage";
import Homecard from "../../components/skeleton/homecard";

const Trending = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/post/trendings`, {
        headers: {
          Authorization: `Bearer ${get("dsh_token")}`,
        },
      })
      .then((response) => {
        setPosts(response.data.response);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <Row className="my-5">
        <Col lg="8" className="m-auto">
          <h1 className="display-4 fw-bold text-blue mb-5">Trendings</h1>

          {loading ? (
            <div className="">
              <Homecard count="5" />
            </div>
          ) : (
            posts &&
            posts.map((post, index) => (
              <div key={post._id} className="d-flex align-items-top">
                <div className="display-1 fw-bold pe-2 text-muted">
                  {index + 1}
                </div>
                <SocialCard post={post} />
              </div>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Trending;
