import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firebaseAuth } from "../../config/firebase";
import { useRouter } from "next/router";

const Header = () => {
  const [isUser, setIsUser] = useState(false);
  const { auth } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      firebaseAuth.signOut();
      window.localStorage.removeItem("auth");
      dispatch({
        type: "LOGOUT",
        payload: null,
      });

      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      setIsUser(true);
    }
  }, [auth]);
  return (
    <div className="h-[8vh] bg-red-400">
      <ul className="w-[50vw] h-full items-center  flex justify-between">
        <li>
          <button>
            <Link href={"/"}>Home</Link>
          </button>
        </li>
        {isUser && auth?.token ? (
          <>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
            <li>
              <Link href={"/chat"}>Chat</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <button>
                <Link href={"/register"}>Register</Link>
              </button>
            </li>
            <li>
              <button>
                <Link href={"/login"}>Login</Link>
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Header;
