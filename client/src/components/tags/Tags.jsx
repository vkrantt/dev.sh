import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { tags } from "../json/tags";

const Tags = ({ className, selected }) => {
  return (
    <div>
      {tags.map((tag) => (
        <Button
          as={Link}
          key={tag.key}
          to={`/explore?q=${tag.value}`}
          className={`rounded-3 btn-sm  p-2  me-2 my-2  border-2  px-3 shadow-xs ${className} 
          ${
            selected === tag.value
              ? "bg-dark text-light-blue border-primary"
              : "text-light active tagsLink bg-dark border-secondary"
          }`}
          variant="light"
        >
          {tag.key}
        </Button>
      ))}
    </div>
  );
};

export default Tags;
