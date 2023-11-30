import { GitBranch } from "lucide-react";
import React from "react";

const Logo = () => {
  return (
    <div className="d-flex align-items-center">
      <GitBranch size="36px" strokeWidth={3} />
      <span className="mx-2 fw-bold"></span>
    </div>
  );
};

export default Logo;
