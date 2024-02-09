import { Github } from "lucide-react";
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
        <a href="https://github.com/vkrantt" target="_blank" rel="noreferrer">
          <Github size={20} />
        </a>
      </Container>
    </Container>
  );
};

export default Footer;
