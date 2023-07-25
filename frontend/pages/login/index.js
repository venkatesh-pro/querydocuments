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
            refreshToken: data.refreshToken,
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
    <div className="flex items-center justify-center h-[70vh]">
      <button
        onClick={handleLogin}
        className="flex border-4 mt-3 p-2 items-center "
      >
        <img
          src="/googleicon.png"
          alt="google icon"
          className="w-[20px] h-[20px]"
        />
        <span className="ml-2">Register with Google</span>
      </button>
    </div>
  );
};

export default index;
