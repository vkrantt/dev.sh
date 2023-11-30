import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

const Explore = () => {
  return (
    <Container>
      <Row className="my-5">
        <Col lg="8" className="m-auto">
          <h1 className="display-4 fw-bold text-blue">Explore</h1>
          <h3>Navigate your way through the guides and tutorials.</h3>

          <div className="my-5">
            <h5 className="text-blue">Discover more of what matters to you</h5>

            <div>
              <Button
                className="fw-bold rounded-2 me-2 my-2"
                size="sm"
                variant="light"
              >
                Programming
              </Button>
              <Button
                className="fw-bold rounded-2 me-2 my-2"
                size="sm"
                variant="light"
              >
                Data science
              </Button>
              <Button
                className="fw-bold rounded-2 me-2 my-2"
                size="sm"
                variant="light"
              >
                Technology
              </Button>
              <Button
                className="fw-bold rounded-2 me-2 my-2"
                size="sm"
                variant="light"
              >
                Machine Learning
              </Button>
              <Button
                className="fw-bold rounded-2 me-2 my-2"
                size="sm"
                variant="light"
              >
                Productivity
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Explore;
