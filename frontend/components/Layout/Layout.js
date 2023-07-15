import React, { useEffect } from "react";
import { firebaseAuth } from "../../config/firebase";
import { useDispatch } from "react-redux";
import Header from "../Navbar/Header";

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
