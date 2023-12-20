import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <Container fluid className="bg-light">
      <Container className=" d-flex justify-content-between pt-3">
        <p>0.0.3</p>
        <p className="d-flex align-items-center">&copy; 2023</p>
        <p>Email</p>
      </Container>
    </Container>
  );
};

export default Footer;
