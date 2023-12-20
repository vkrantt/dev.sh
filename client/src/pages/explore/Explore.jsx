import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Tags from "../../components/tags/Tags";

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
              <>
                <Tags className="fw-bold me-2 my-2 " />
              </>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Explore;
