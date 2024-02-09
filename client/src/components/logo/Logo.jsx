import { Code } from "lucide-react";
import React from "react";

const Logo = ({ show, className }) => {
  return (
    <div className="d-flex align-items-center">
      <Code size="28px" strokeWidth={2} className={`text-primary`} />
      {show ? <span className={`mx-2 ${className}`}>dev.sh</span> : null}
    </div>
  );
};

export default Logo;
