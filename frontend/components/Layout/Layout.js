import React, { useEffect } from "react";
import { firebaseAuth } from "../../config/firebase";
import { useDispatch } from "react-redux";
import Header from "../Navbar/Header";
import { currentUserFunction } from "../../function/auth";

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const { data } = await currentUserFunction(idTokenResult.token);
        if (data) {
          dispatch({
            type: "LOGIN",
            payload: {
              name: data.name,
              email: data.email,
              role: data.role,
              _id: data._id,
              token: idTokenResult.token,
            },
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
