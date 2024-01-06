import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { tags } from "../json/tags";

const Tags = ({ className }) => {
  return (
    <>
      {tags.map((tag) => (
        <Button
          as={Link}
          key={tag.key}
          to={`/explore?q=${tag.value}`}
          className={`rounded-0  p-2 tagsLink me-2 my-2  border-0 border-bottom border-primary border-3 shadow-xs ${className}`}
          variant="light"
        >
          {tag.key}
        </Button>
      ))}
    </>
  );
};

export default Tags;
