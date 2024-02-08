import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  const d = new Date();
  let year = d.getFullYear();
  return (
    <Container fluid className="bg-dark">
      <Container className=" d-flex justify-content-between pt-3">
        <p>V0.0.6</p>
        <p className="d-flex align-items-center">&copy; {year}</p>
        <p>Email</p>
      </Container>
    </Container>
  );
};

export default Footer;
