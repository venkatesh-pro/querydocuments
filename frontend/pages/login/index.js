import React, { useEffect } from "react";
import { firebaseAuth, googleAuthProvider } from "../../config/firebase";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { loginFunction } from "../../function/auth";

const index = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await firebaseAuth.signInWithPopup(googleAuthProvider);

      const { user } = res;
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const { data } = await loginFunction(idTokenResult.token);

        window.localStorage.setItem("auth", JSON.stringify(data));

        dispatch({
          type: "LOGIN",
          payload: {
            name: data.name,
            email: data.email,
            role: data.role,
            _id: data._id,
            token: data.token,
          },
        });
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, []);
  return (
    <div>
      <button className="border-2" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default index;
