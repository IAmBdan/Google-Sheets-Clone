// src/Header.tsx

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Header: React.FC = () => {
  return (
    <>
      <header className="bg-gray-200 p-8">Welcome to Husksheet!</header>
      <div className="btn-toolbar">
        <div className="btn-group">
          <button className="btn btn-primary">Sign Up</button>
        </div>
      </div>
    </>
  );
};

export default Header;
