import React, { useEffect } from "react";
import { firebaseAuth } from "../../config/firebase";
import { useDispatch } from "react-redux";
import Header from "../Navbar/Header";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  return (
    <div>
      {router.pathname !== "/chat" && <Header />}
      {children}
    </div>
  );
};

export default Layout;
