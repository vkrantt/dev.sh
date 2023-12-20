import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = ({ variant }) => {
  return (
    <Spinner
      variant={variant ? variant : "primary"}
      animation="border"
      size="sm"
    />
  );
};

export default Loader;
