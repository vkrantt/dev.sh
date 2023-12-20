import React from "react";
import Logo from "../logo/Logo";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <Container fluid className="">
      <Container className=" d-flex justify-content-between pt-3">
        <p>0.0.3</p>
        <div className="d-flex align-items-center">
          &copy; 2023
          <span className="text-decoration-underline">
            <Logo />
          </span>
        </div>
        <p>Twitter</p>
      </Container>
    </Container>
  );
};

export default Footer;
