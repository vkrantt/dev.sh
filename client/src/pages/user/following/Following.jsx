import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Following = () => {
  return (
    <Container>
      <Row>
        <Col lg="8" md="12" sm="12" className="m-auto mb-5">
          <h1 className="display-4 fw-bold text-blue my-3">Following</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default Following;