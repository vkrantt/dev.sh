import { GitBranch } from "lucide-react";
import React from "react";

const Logo = ({ show }) => {
  return (
    <div className="d-flex align-items-center">
      <GitBranch size="28px" strokeWidth={1} className="text-primary" />
      {show ? <span className="mx-2">dev.sh</span> : null}
    </div>
  );
};

export default Logo;
