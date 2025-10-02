import React from "react";
import PropTypes from "prop-types";
import "../../Css/global.css"; // Corrected path to global.css

const Button = ({ variant = "primary", children, className = "", ...props }) => {
  const buttonClass = `btn-${variant} ${className}`.trim();

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(["primary", "secondary", "google", "destructive"]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Button;
