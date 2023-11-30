import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import SocialCard from "../../components/socialCard.jsx/SocialCard";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import { useState } from "react";

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
      <Row>
        <Col lg="8">
          {posts &&
            posts.map((post) => (
              <div key={post._id}>
                <SocialCard post={post} />
              </div>
            ))}
        </Col>

        <Col lg="4">
          <div>
            <h5>Discover more of what matters to you</h5>

            <div>
              <Button className="rounded-2 me-2 my-2" variant="light">
                Programming
              </Button>
              <Button className="rounded-2 me-2 my-2" variant="light">
                Data science
              </Button>
              <Button className="rounded-2 me-2 my-2" variant="light">
                Technology
              </Button>
              <Button className="rounded-2 me-2 my-2" variant="light">
                Machine Learning
              </Button>
              <Button className="rounded-2 me-2 my-2" variant="light">
                Productivity
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
