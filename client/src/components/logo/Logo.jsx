import { GitBranch } from "lucide-react";
import React from "react";

const Logo = ({ show }) => {
  return (
    <div className="d-flex align-items-center">
      <GitBranch size="36px" strokeWidth={3} />
      {show ? <span className="mx-2 fw-bold">dev.sh</span> : null}
    </div>
  );
};

export default Logo;
