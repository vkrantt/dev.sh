import React from "react";
import { Placeholder } from "react-bootstrap";

const Homecard = ({ count }) => {
  const placeholders = Array.from({ length: count }).map((_, index) => (
    <div key={index} className="bg-dark mb-4 w-100 p-4 rounded-2">
      <Placeholder as="p" animation="glow">
        <Placeholder xs={4} />
      </Placeholder>
      <Placeholder as="p" animation="glow">
        <Placeholder xs={12} />
      </Placeholder>
      <Placeholder as="p" animation="glow">
        <Placeholder xs={12} />
        <Placeholder xs={12} />
        <Placeholder xs={12} />
      </Placeholder>
      <Placeholder as="p" animation="glow">
        <Placeholder xs={2} className="me-2" />
        <Placeholder.Button xs={3} aria-hidden="true" />
      </Placeholder>
    </div>
  ));

  return <>{placeholders}</>;
};

export default Homecard;
