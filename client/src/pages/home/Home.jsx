import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import SocialCard from "../../components/socialCard.jsx/SocialCard";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import { useState } from "react";
import Homecard from "../../components/skeleton/homecard";
import Tags from "../../components/tags/Tags";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/post`)
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
      <Row className="d-flex flex-md-row-reverse">
        <Col lg="8" className="order-last">
          <h1 className="display-4 fw-bold text-primary my-3">Feed</h1>
          {/* Content for the first column */}
          {loading ? (
            <div className="">
              <Homecard count="5" />
            </div>
          ) : (
            posts &&
            posts.map((post) => (
              <div key={post._id}>
                <SocialCard post={post} />
              </div>
            ))
          )}
        </Col>

        <Col lg="4" className="position-relative order-first">
          {/* Content for the second column */}
          <div className="top-0 end-0 position-sticky pt-3">
            <h5>Discover more of what matters to you</h5>
            <>
              <Tags />
            </>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
