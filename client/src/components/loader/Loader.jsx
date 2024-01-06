import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = ({ variant, size }) => {
  return (
    <Spinner
      variant={variant ? variant : "primary"}
      animation="border"
      size={size ? size : "sm"}
    />
  );
};

export default Loader;
