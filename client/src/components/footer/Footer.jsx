import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  const d = new Date();
  let year = d.getFullYear();
  return (
    <Container fluid className="bg-dark">
      <Container className=" d-flex justify-content-between pt-3">
        <p>V1.0.1</p>
        <p className="d-flex align-items-center">&copy; {year}</p>
        <p>Email</p>
      </Container>
    </Container>
  );
};

export default Footer;
