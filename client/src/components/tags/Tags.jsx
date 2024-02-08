import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { tags } from "../json/tags";

const Tags = ({ className }) => {
  return (
    <div>
      {tags.map((tag) => (
        <Button
          as={Link}
          key={tag.key}
          to={`/explore?q=${tag.value}`}
          className={`rounded-3 btn-sm text-light active p-2 tagsLink me-2 my-2 bg-secondary border-2 border-secondary px-3 shadow-xs ${className}`}
          variant="light"
        >
          {tag.key}
        </Button>
      ))}
    </div>
  );
};

export default Tags;
