import React, { useEffect } from "react";
import { firebaseAuth, googleAuthProvider } from "../../config/firebase";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { registerFunction } from "../../function/auth";

const index = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await firebaseAuth.signInWithPopup(googleAuthProvider);

      const { user } = res;
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        const { data } = await registerFunction(idTokenResult.token);
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
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, []);
  return (
    <div>
      <button className="border-2" onClick={handleSignIn}>
        Register
      </button>
    </div>
  );
};

export default index;
